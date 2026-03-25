import os
# Fix for Windows PyTorch "WinError 1114" - Must be before ANY torch/numpy import
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

import traceback
from openai import OpenAI
from pinecone import Pinecone
from app.core.config import settings

class RAGService:
    def __init__(self):
        # 1. Initialize Pinecone
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        host = os.getenv("PINECONE_HOST")
        if host:
             self.index = self.pc.Index(name=settings.PINECONE_INDEX_NAME, host=host)
        else:
             self.index = self.pc.Index(settings.PINECONE_INDEX_NAME)

        # 2. Initialize OpenRouter Client (LLM Only)
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY,
        )

        # THE FLAWLESS PERSONA PROMPT
        self.system_prompt = """
        You are 'MamaBot', a warm, empathetic, and highly intelligent maternal health assistant for the MamaCare platform in Kenya.

        YOUR CORE BEHAVIORS:
        1. THE ILLUSION OF KNOWLEDGE: You will be provided with 'Internal Knowledge' to help you answer. Act as if you naturally know this information. ABSOLUTELY NEVER use phrases like "Based on the text", "According to the context", or "The information you shared." Just give the answer directly.
        2. TONE & FORMATTING: Speak like a supportive, knowledgeable friend. Use short paragraphs, bold text for key points, and friendly emojis (🌸, 👶, 🍎) to make it easy to read on mobile.
        3. CASUAL CONVERSATION: If the user says hello or asks what you can do, warmly introduce yourself! You help with pregnancy tips, diet, and recognizing symptoms. DO NOT add medical disclaimers to simple greetings or casual chat.
        4. MEDICAL SAFETY & FALLBACK: If the user asks a health question, use your Internal Knowledge. If the Internal Knowledge doesn't cover it, use your general safe medical knowledge to give a helpful, educational answer.
        5. THE DISCLAIMER RULE: ONLY IF you are giving specific health, diet, or symptom advice, end your message with a gentle disclaimer like: "*Please remember to verify this with your doctor or midwife.*" NEVER diagnose or prescribe.
        """
        
        # 3. Initialize Local Embeddings
        print("Loading local embedding model: nomic-ai/nomic-embed-text-v1.5")
        from sentence_transformers import SentenceTransformer
        self.embedder = SentenceTransformer("nomic-ai/nomic-embed-text-v1.5", trust_remote_code=True)

    def get_embedding(self, text: str):
        """Generates embedding using Local SentenceTransformer"""
        text = text.replace("\n", " ")
        prefix = "search_query: " 
        try:
            return self.embedder.encode(prefix + text).tolist()
        except Exception as e:
            print(f"Embedding Error: {e}")
            raise e

    def get_response(self, query: str):
        try:
            # 1. Generate Embedding (Local)
            query_embedding = self.get_embedding(query)

            # 2. Retrieve Context from Pinecone
            results = self.index.query(
                vector=query_embedding,
                top_k=3, 
                include_metadata=True
            )

            context_texts = [match['metadata']['text'] for match in results['matches'] if match.score > 0.3]
            source_docs = list(set([match['metadata']['source'] for match in results['matches'] if match.score > 0.3]))
            
            # THE FIX: Hide the "Context" framing from the AI
            if context_texts:
                context_block = "\n---\n".join(context_texts)
                source_label = f"RAG ({', '.join(source_docs)})"
                # Frame it as internal memory, not an external document
                injected_message = f"INTERNAL KNOWLEDGE:\n{context_block}\n\nUSER QUESTION:\n{query}"
            else:
                source_label = "MamaBot Core (General AI)"
                # Just pass the question if no PDF data was found
                injected_message = f"USER QUESTION:\n{query}"

            # 3. Augment Prompt (Clean injection)
            final_messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": injected_message}
            ]

            # 4. Generate Answer via LLM
            completion = self.client.chat.completions.create(
                model="openrouter/free",
                messages=final_messages,
                temperature=0.4 
            )
            
            ai_reply = completion.choices[0].message.content
            
            return {
                "response": ai_reply,
                "source": source_label
            }

        except Exception as e:
            print(f"RAG Service Error: {e}")
            traceback.print_exc()
            return {
                "response": "I encountered a connection error with my brain right now. Please try again in a moment.",
                "source": "System Error"
            }

# Initialize Service
try:
    rag_service = RAGService()
except Exception as e:
    print(f"Failed to initialize RAG Service: {e}")
    rag_service = None