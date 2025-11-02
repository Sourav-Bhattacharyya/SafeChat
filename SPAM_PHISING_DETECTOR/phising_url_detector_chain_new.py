from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel,Field
import dotenv
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

class URLSchema(BaseModel):
    is_phising : bool = Field(description="This field tells whether the url is phising or not")
   

parser = PydanticOutputParser(pydantic_object=URLSchema)

prompt = PromptTemplate(
    template="""
You are a URL-structure phishing detector.  
Task: Given a single URL string, analyze only the URL text (no external lookups, no WHOIS, no certificate checks, no page fetch).  
Decide whether the URL is likely phishing based purely on structural and lexical signals.  

Output format (strict): produce only a JSON object matching this schema (no extra text, no code fences, nothing else):

{{
  "is_phising": <true|false>
}}

Use the exact field name: `is_phising` (boolean).

Heuristics to apply (only these — do NOT fetch anything):
1. Domain is an IP address (e.g., http://192.168.0.1/...) → suspicious.  
2. Domain contains brand name + extra word (e.g., paypal-secure.com) or misleading subdomain → suspicious.  
3. Path or query contains keywords like login, verify, update, account, bank, password, etc. → suspicious.  
4. Presence of @ symbol in URL → suspicious.  
5. Unusually long URL or excessive encoding (%20, %00, etc.) → suspicious.  
6. Uses uncommon ports (:8080, :4443) → suspicious.  
7. URL shorteners (bit.ly, t.co, tinyurl.com) → potentially suspicious.  
8. Rare or cheap-looking TLD combined with brand keywords → suspicious.  

Decision logic:  
- Multiple suspicious signals → is_phising: true.  
- Clean, legitimate structure → is_phising: false.  
- If uncertain, lean towards true.

Output constraints:  
- Only return JSON.  
- No explanation text.

Examples:  
Input: https://www.paypal.com/signin  
Output: {{"is_phising": false}}

Input: http://paypal-secure-login.com/account/verify  
Output: {{"is_phising": true}}

Now analyze the following URL and return the JSON result only:

{url}

\n\n

{format_instruction}
""",
    input_variables=["url"],
    partial_variables={"format_instruction": parser.get_format_instructions()}
)


llm = ChatGoogleGenerativeAI(model ="gemini-2.5-flash",api_key =api_key)

final_chain = prompt | llm |parser

if __name__ == '__main__':

    url = input("Enter the url:")
    result = final_chain.invoke(url)
    
    result_dict = dict(result)

    for key,value in result_dict.items():
        print(f"{key} : {value}")



