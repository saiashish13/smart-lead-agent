from flask_mail import Mail, Message

mail = Mail()

def send_email(to, subject, body):
    msg = Message(subject, recipients=[to], body=body)
    mail.send(msg)
