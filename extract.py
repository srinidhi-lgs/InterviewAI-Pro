from pypdf import PdfReader
reader = PdfReader(r"D:\Desktop\InterviewAI Pro\backend\uploads\resumes\c2a9580d-4f84-49a0-8d81-77eba29c19ec\7812cd14-e573-4271-b456-8610757c9a58.pdf")
text = "\n".join([page.extract_text() or "" for page in reader.pages])
with open(r"D:\Desktop\InterviewAI Pro\extracted_resume_text.txt", "w", encoding="utf-8") as f:
    f.write(text)
print("EXTRACTED LENGTH:", len(text))
