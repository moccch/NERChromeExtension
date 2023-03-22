import torch
from flask import Flask, request

app = Flask(__name__)

@app.route('/input', methods=['POST'])
def example():
    sentences = request.json.get('text')
    print("backend receive message")
    print("----------------------------------------------------------------------")
    print(sentences)
    print("----------------------------------------------------------------------")
   
    model = torch.load("model.pth")
    results = model(sentences)
    I_tokens = ['I-PER', 'I-LOC', 'I-ORG', 'I-MISC']
    r_list = []
    for r in results:
        if r['entity'] in I_tokens:
            if r['word'][0] == '#':
                continue
            if len(r['word']) == 1:
                continue
            r_list.append(r['word'])
    print("result: ", r_list)
    return r_list

if __name__ == '__main__':
    app.run(debug=True)
