from flask import Flask, render_template, request, jsonify
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

app = Flask(__name__)

# ---------------- ROUTES ---------------- #
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/services")
def services():
    return render_template("services.html")

@app.route("/gallery")
def gallery():
    return render_template("gallery.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

# ---------------- CONTACT FORM SUBMIT ---------------- #
@app.route("/submit-contact", methods=["POST"])
def submit_contact():
    data = request.form
    print("📩 FORM DATA RECEIVED:", data)

    SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
    FROM_EMAIL = os.getenv("SENDGRID_FROM_EMAIL")
    TO_EMAIL = os.getenv("SENDGRID_TO_EMAIL")

    if not all([SENDGRID_API_KEY, FROM_EMAIL, TO_EMAIL]):
        print("❌ SendGrid ENV missing")
        return jsonify({"success": True}), 200  # NEVER fail user

    try:
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=TO_EMAIL,
            subject="📩 New Wedding Inquiry - Parampara",
            plain_text_content=f"""
New Event Inquiry Received 🎉

Full Name: {data.get('fullName')}
Phone: {data.get('phone')}
Email: {data.get('email')}
Event Date: {data.get('eventDate')}
Event City: {data.get('eventCity')}
Event Type: {data.get('eventType')}
Guests: {data.get('guestCount')}

Description:
{data.get('description')}
"""
        )

        sg = SendGridAPIClient(SENDGRID_API_KEY)
        sg.send(message)

        print("✅ EMAIL SENT VIA SENDGRID")

    except Exception as e:
        # IMPORTANT: Never break the user flow
        print("⚠️ SENDGRID ERROR (ignored):", e)

    return jsonify({"success": True}), 200


# ---------------- RUN APP ---------------- #
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
