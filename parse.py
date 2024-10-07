import os
import json
import re

def parse_txt_files(directory):
    questions = []
    question_pattern = re.compile(r'^\d+\.\s*(.*)')
    option_pattern = re.compile(r'^-\s*(.*)')
    correct_option_pattern = re.compile(r'^(.*)\s*\(\*\)$')
    
    for filename in os.listdir(directory):
        if filename.endswith('.txt'):
            with open(os.path.join(directory, filename), 'r', encoding='utf-8') as file:
                lines = file.readlines()
                
                i = 0
                while i < len(lines):
                    line = lines[i].strip()
                    question_match = question_pattern.match(line)
                    if question_match:
                        question_text = question_match.group(1).strip()
                        options = []
                        correct_answers = []
                        i += 1
                        # Skip any blank lines after the question
                        while i < len(lines) and lines[i].strip() == '':
                            i += 1
                        # Collect options
                        while i < len(lines):
                            line = lines[i].strip()
                            if line == '':
                                i += 1
                                continue
                            option_match = option_pattern.match(line)
                            if option_match:
                                option_text = option_match.group(1).strip()
                                correct_match = correct_option_pattern.match(option_text)
                                if correct_match:
                                    option_text = correct_match.group(1).strip()
                                    correct_answers.append(option_text)
                                options.append(option_text)
                                i += 1
                            else:
                                # Break if the line doesn't start with an option indicator
                                break
                        questions.append({
                            'question': question_text,
                            'options': options,
                            'correct_answers': correct_answers
                        })
                    else:
                        i += 1
    return questions

# Usage
questions = parse_txt_files('.')
with open('questions.json', 'w', encoding='utf-8') as json_file:
    json.dump(questions, json_file, ensure_ascii=False, indent=4)
