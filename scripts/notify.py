import json
import os
import pandas as pd
import telegram

TELEGRAM_TOKEN = os.environ["telegram_token"]

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

bot.send_message(chat_id="-4568154747", text='Guten Morgen! Hier ist der aktuelle Stand!')

if df['4. close'][-1] > df['200_sma'][-1]:
    bot.send_message(chat_id="-4568154747", text=
                     r'''
                     Der 200 days simple moving average liegt unter dem aktuellen Preis!
Aktueller Preis: {0}€
200 SMA: {1}€'''.format(df['4. close'][-1], df['200_sma'][-1]))
elif df['4. close'][-1] < df['200_sma'][-1]:
    bot.send_message(chat_id="-4568154747", text=
                     r'''
                    Der 200 days simple moving average liegt über dem aktuellen Preis!
Aktueller Preis: {0}€
200 SMA: {1}€
Starkes Kaufsignal!'''.format(df['4. close'][-1], df['200_sma'][-1]))
else:
    bot.send_message(chat_id="-4568154747", text='Hier passt was nicht...')

