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
model = genai.GenerativeModel("gemini-1.0-pro")
prompt = r'''
Schreibe eine kurze, präzise, lockere Telegramm-Chat-Nachricht an die Investoren.
Schreibe wie ein risikofreudiger Nutzer des Subreddits "Mauerstrassenwetten"
Benutze hierbei die gegeben Zeitreihe, vergleiche den Kurs mit dem sma200, gib ein Update wie der Titel "Amundi ETF Leveraged MSCI USA Daily UCITS ETF EUR" aktuell performt.
Nenne aktuell Werte und gib eine Prognose ab.
Die Zeitreihe: {0}
Der SMA200: {1}
Heute ist der {2}
Baue ein Witz über gehebelte Finanzprodukte ein.
Spare dir den Risiko Hinweis, ist bereits bekannt'''.format(df['4. close'].tail(100).to_string(), df['200_sma'].tail(100).to_string(), df['4. close'].tail(1).index)
response = model.generate_content(prompt, request_options={"timeout": 1000})
print(prompt)
bot.send_message(chat_id="-4568154747", text=response.text)
