
import re
from langgraph.graph import StateGraph,START,END
from typing import TypedDict,List
from spam_detector_model import predict_spam_message
from phising_url_ml import predict_phising_url
class MessageState(TypedDict):
    message : str
    urls :List[str]
    is_spam :bool
    is_phising :bool
    

def remove_urls(text: str) -> str:
    """
    Removes all URLs (http, https, www) from the input text.

    Args:
        text (str): The input text possibly containing URLs.

    Returns:
        str: The cleaned text with URLs removed.
    """
    # Regex to match http, https, or www URLs
    url_pattern = r'(https?://\S+|www\.\S+)'

    # Remove URLs and extra spaces
    cleaned_text = re.sub(url_pattern, '', text)
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
    return cleaned_text


def extract_urls(message):
    """
    Detects and extracts URLs starting with http or https from a given message.
    
    Args:
        message (str): The input text message.
    
    Returns:
        list: A list of all detected URLs (empty if none found).
    """
    # Regular expression for matching URLs
    url_pattern = r'(https?://[^\s]+)'
    
    # Find all matching URLs
    urls = re.findall(url_pattern, message)
    
    # Return list of URLs (can be empty)
    return urls



def extract_url_node(state : MessageState):

    message = state["message"]

    url_list = extract_urls(message)

    return {
        "urls" : url_list
    }


def phising_url_node(state : MessageState):

    urls = state["urls"]
    response_state = {}
    if urls:
        phising = False
        for url in urls:
            response = predict_phising_url(url)
            if response == "PHISING":
                phising = True
                response_state["is_phising"] = True
                break

        if  not phising:
            response_state["is_phising"] = False
        


    else:
        response_state["is_phising"] = False
    
    return response_state

def spam_detection_node(state : MessageState):

    message = state["message"]
    message = remove_urls(message)
    prediction = predict_spam_message(message=message)
    
    response_state = {}

    if prediction == "SPAM":
        response_state["is_spam"] = True
    else:
        response_state["is_spam"] = False
    return response_state


def combine_node(state : MessageState):
    return state

workflow = StateGraph(MessageState)

workflow.add_node("extract_url_node",extract_url_node)
workflow.add_node("phising_url_node",phising_url_node)
workflow.add_node("spam_detection_node",spam_detection_node)
workflow.add_node("combine_node",combine_node)

workflow.set_entry_point("extract_url_node")
workflow.add_edge("extract_url_node","phising_url_node")
workflow.add_edge("extract_url_node","spam_detection_node")
workflow.add_edge("phising_url_node","combine_node")
workflow.add_edge("spam_detection_node","combine_node")

workflow.add_edge("combine_node",END)

graph = workflow.compile()

def predict_message_safety(message : str):
    start_state = {
        "message" : message,
        "urls":[],
        "is_spam" :False,
        "is_phising" : False
    }
    result = graph.invoke(start_state)
    dict_response = dict(result)

    final_response = {}
    final_response["is_spam"] = dict_response.get("is_spam")
    final_response["is_phising"] = dict_response.get("is_phising")

    return final_response


if __name__ == '__main__':
   
    message = ""

    with open("message.txt",'r',encoding='utf-8') as f:
        message = f.read()

    
    result = predict_message_safety(message)

    for key, value in result.items():
        print(f"{key} : {value}")
