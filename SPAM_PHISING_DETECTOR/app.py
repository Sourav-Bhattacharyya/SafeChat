from fastapi import FastAPI,HTTPException
from pydantic import BaseModel,Field
from message_safety_checker import predict_message_safety

app = FastAPI(title="Message Safety Checker", version="1.0")

class MessageInput(BaseModel):
    message : str = Field(...,description="The message text to be analyzed")

class PredictionResponse(BaseModel):
    is_phising : bool
    is_spam : bool

@app.post("/predict",response_model=PredictionResponse)
async def predict_message(input_data : MessageInput):
    try:
        message = input_data.message.strip()

        if not message:
            raise HTTPException(status_code=400, detail="Message cannot be empty or whitespace.")
        
        try:
            result = predict_message_safety(message)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error while processing message: {str(e)}")
        
        if not isinstance(result,dict):
            raise HTTPException(status_code=500, detail="Model returned invalid response type.")
        
        return PredictionResponse(**result)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected server error: {str(e)}")
