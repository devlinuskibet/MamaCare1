from openai import OpenAI
from app.core.config import settings

class ChatbotService:
    def __init__(self):
        # Initialize the OpenAI Client with the key from settings
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        
        # THE GUARDRAILS: This tells the AI how to behave.
        self.system_prompt = """
        You are 'MamaBot', an empathetic and supportive maternal health assistant for the MamaCare platform.
        
        YOUR RULES:
        1. TONE: Be warm, comforting, and encouraging (like a wise older sister).
        2. BOUNDARIES: You are NOT a doctor. DO NOT provide medical diagnoses.
           - If a user describes severe symptoms (bleeding, severe headache, vision changes), 
             you MUST tell them to visit a hospital immediately.
           - Use phrases like "This can be normal, but strictly speaking..." or "Please consult your provider."
        3. CONTEXT: The user is a pregnant mother in Kenya. Keep advice practical and culturally relevant if possible.
        4. BREVITY: Keep answers concise (under 3-4 sentences) so they are easy to read on a phone.
        """

    def get_response(self, user_message: str):
        try:
            # Call the OpenAI API (GPT-3.5-turbo is fast and cheap)
            completion = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7, # Adds a little creativity/warmth
                max_tokens=150   # Keeps response short
            )

            # Extract the actual text reply
            ai_reply = completion.choices[0].message.content

            return {
                "response": ai_reply,
                "source": "MamaCare AI (Powered by OpenAI)"
            }

        except Exception as e:
            print(f"Error calling OpenAI: {e}")
            
            # Check for Quota/Billing Error (429)
            if "insufficient_quota" in str(e) or "429" in str(e):
                return {
                    "response": "[DEMO MODE] I see you're testing! Since the AI budget is paused, I'll simulate a response: 'That is a great question about maternal health. Typically, staying hydrated and resting is good advice, but always check with your doctor.'",
                    "source": "MamaCare Demo (Quota Exceeded Protection)"
                }
                
            return {
                "response": "I'm having trouble connecting to my brain right now. Please try again in a moment.",
                "source": "System Error"
            }

chatbot_service = ChatbotService()