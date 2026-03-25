import os
import time
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "mama-care")
PINECONE_HOST = os.getenv("PINECONE_HOST")

# Fix for Windows OpenMP conflict (Critical for local embedding)
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

class IngestionPipeline:
    def __init__(self):
        # Initialize Pinecone
        self.pc = Pinecone(api_key=PINECONE_API_KEY)
        
        # Connect to Index
        print(f"Connecting to Pinecone Index: {PINECONE_INDEX_NAME}")
        if PINECONE_HOST:
             print(f"Using Host: {PINECONE_HOST}")
             self.index = self.pc.Index(name=PINECONE_INDEX_NAME, host=PINECONE_HOST)
        else:
             self.index = self.pc.Index(PINECONE_INDEX_NAME)
        
        # Initialize Local Embedding Model (SentenceTransformers)
        print("Loading local embedding model: nomic-ai/nomic-embed-text-v1.5")
        # trust_remote_code=True is often needed for Nomic, but v1.5 might be standard. 
        # We will use it to be safe as per Nomic docs.
        self.model = SentenceTransformer("nomic-ai/nomic-embed-text-v1.5", trust_remote_code=True)

    def get_embedding(self, text):
        # Generate embedding locally
        # Accessing the Nomic model which typically returns a single vector or matrix
        # Encode returns a numpy array
        embedding = self.model.encode(text)
        return embedding.tolist()

    def run(self):
        knowledge_base_dir = "knowledge_base"
        if not os.path.exists(knowledge_base_dir):
            os.makedirs(knowledge_base_dir)
            print(f"Created {knowledge_base_dir}. Please put PDFs here.")
            return

        pdf_files = [f for f in os.listdir(knowledge_base_dir) if f.endswith('.pdf')]
        if not pdf_files:
            print("No PDFs found.")
            return

        full_docs = []
        print(f"Loading {len(pdf_files)} PDFs...")
        for pdf in pdf_files:
            loader = PyPDFLoader(os.path.join(knowledge_base_dir, pdf))
            full_docs.extend(loader.load())

        # Chunking: 400 to 700 tokens. 
        # Approx 2000 chars ~ 500 tokens.
        print("Splitting text...")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1500, 
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_documents(full_docs)
        print(f"Generated {len(chunks)} chunks.")

        print("Embedding and Upserting to Pinecone...")
        batch_size = 50 
        
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i+batch_size]
            vectors = []
            
            for j, doc in enumerate(batch):
                try:
                    text_content = doc.page_content.replace("\n", " ").strip()
                    if not text_content: continue

                    # Generate local embedding
                    prefix = "search_document: " # Nomic V1.5 recommends prefixes for tasks
                    embedding = self.get_embedding(prefix + text_content)
                    
                    vector_id = f"chunk_{i+j}_{int(time.time())}"
                    metadata = {
                        "text": text_content,
                        "source": os.path.basename(doc.metadata.get("source", "unknown")),
                        "page": doc.metadata.get("page", 0)
                    }
                    
                    vectors.append({
                        "id": vector_id,
                        "values": embedding,
                        "metadata": metadata
                    })
                    
                except Exception as e:
                    print(f"Error processing chunk {i+j}: {e}")
            
            if vectors:
                self.index.upsert(vectors=vectors)
                print(f"Upserted batch {i} to {i+len(batch)}")

        print("\nIngestion Complete! 🚀")

if __name__ == "__main__":
    pipeline = IngestionPipeline()
    pipeline.run()
