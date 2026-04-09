import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# تحميل المفتاح من ملف .env
load_dotenv()
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

MODEL_ID = "google/gemma-3-27b-it:free"

def generate_description(name, specs):
    print(f"--- جاري توليد وصف لـ {name} ---")
    prompt = f"اكتب وصفاً تسويقياً احترافياً وجذاباً للمنتج التالي: {name}. المواصفات: {specs}. اجعل الوصف مناسباً لموقع تجارة إلكترونية."
    
    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

def save_product(product_data):
    file_path = 'products.json'
    products = []
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            products = json.load(f)
    
    products.append(product_data)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=4)
    print("✅ تم حفظ المنتج في قاعدة البيانات.")

# تجربة إضافة منتج
name = input("اسم المنتج: ")
specs = input("المواصفات الأساسية: ")

desc = generate_description(name, specs)
print(f"\nالوصف المقترح:\n{desc}\n")

product = {
    "name": name,
    "specs": specs,
    "description": desc
}

save_product(product)
