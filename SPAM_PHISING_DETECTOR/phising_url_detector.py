from phising_url_detector_chain import final_chain

def predict_phising_url(url : str):
    
    response = dict(final_chain.invoke(url))

    final_response = {}

    if response.get("is_phising"):
        final_response["phising_status"] = "PHISING"
        final_response["explaination"] = response.get("explaination")
    else:
        final_response["phising_status"] = "SAFE"
        final_response["explaination"] = "Not a phising url"

    return final_response
        
if __name__ == '__main__':
    url = input("Enter the url: ")

    response = predict_phising_url(url)

    for key,value in response.items():
        print(f"{key} : {value}")


