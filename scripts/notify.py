import json
import os
import pandas as pd
import telegram
import google.generativeai as genai

TELEGRAM_TOKEN = os.environ["telegram_token"]
GEMINI_TOKEN = os.environ["gemini_token"]

def load_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

file_path = 'src/data.json'
data = load_json(file_path)

# Extract only the "Time Series (Daily)" part of the JSON
time_series_daily = data.get("Time Series (Daily)", {})

# Convert the extracted data to a DataFrame
df = pd.DataFrame.from_dict(time_series_daily, orient='index')
df.sort_index(inplace=True)
df['4. close'] = df['4. close'].astype(float)
df['200_sma'] = df['4. close'].rolling(window=200).mean()

bot = telegram.Bot(token=TELEGRAM_TOKEN)

genai.configure(api_key=GEMINI_TOKEN)
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content(["Schreibe eine humorvolle Nachricht an die Investoren. Benutze hierbei die Zeitreihe und den 200SMA, gib ein Update wie der Amumbo aktuell performt und einen kleinen Ausblick", df['4. close'].to_string(), df['200_sma'].to_string()] , request_options={"timeout": 1000})
bot.send_message(chat_id="-4568154747", text=response.text)