import os
from flask_mail import Mail, Message

mail = Mail()

def send_email(to, subject, body):
    sender = os.environ.get("GMAIL_USER")
    msg = Message(subject, sender=sender, recipients=[to], body=body)
    mail.send(msg)
