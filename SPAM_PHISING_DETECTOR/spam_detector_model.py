import pickle
import string,nltk
nltk.download('punk_tab')
nltk.download('punkt')
nltk.download('stopwords')

from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

ps = PorterStemmer()




def transform_text(text):
    text = text.lower()
    text = nltk.word_tokenize(text)
    y = []

    for i in text:
        if i.isalnum():
            y.append(i)
        
    text = y[:]
    y.clear()
    for i in text:
        if i not in stopwords.words('english') and i not in string.punctuation:
            y.append(i)
    text = y[:]
    y.clear()
    for i in text:
        y.append(ps.stem(i))
    return " ".join(y)


tfidf = pickle.load(open('vectorizer.pkl','rb'))

model = pickle.load(open('model.pkl','rb'))

def predict_spam_message(message : str):
    # 1. Preprocess
    transformed_sms = transform_text(message)
    # 2. Vectorize
    vector_input = tfidf.transform([transformed_sms])
    # 3. Predict
    result = model.predict(vector_input)[0]
    # 4. Display
    if result == 1:
        return "SPAM"
    else:
        return "HAM"
    

if __name__  == '__main__':
    text = ""
    with open('message2.txt','r',encoding='utf-8') as f:
        text = f.read()
    
    prediction = predict_spam_message(text)
    print(f"\n\n\n\nPrediction is : {prediction}")
    
   
