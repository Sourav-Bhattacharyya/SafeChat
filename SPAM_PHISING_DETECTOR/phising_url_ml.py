import pickle
import re


vector = pickle.load(open("vectorizer_phising.pkl", 'rb'))
model = pickle.load(open("phishing.pkl", 'rb'))


def predict_phising_url(url : str):
        
        cleaned_url = re.sub(r'^https?://(www\.)?', '', url)
        # print(cleaned_url)
        
        predict = model.predict(vector.transform([cleaned_url]))[0]
        # print(predict)
        
        if predict == 'bad':
            predict = "PHISING"
        elif predict == 'good':
            predict = "SAFE"
        else:
            predict = "Something went wrong !!"
        
        return predict


if __name__ == '__main__':
     
     while True:
          url = input("Enter the url:")
          prediction = predict_phising_url(url)
          print(prediction)