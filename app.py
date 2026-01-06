from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
import os

# ---------------- LOAD ENV VARIABLES ---------------- #
# Render will inject environment variables, so no .env is required in production
# load_dotenv() is optional for local testing only
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)

# ---------------- MAIL CONFIG ---------------- #
# Default values for safety in case Render vars are missing
app.config['MAIL_SERVER'] = os.getenv("MAIL_SERVER", "smtp.gmail.com")
app.config['MAIL_PORT'] = int(os.getenv("MAIL_PORT", 587))
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['MAIL_USE_TLS'] = os.getenv("MAIL_USE_TLS", "True") == "True"
app.config['MAIL_USE_SSL'] = os.getenv("MAIL_USE_SSL", "False") == "True"
app.config['MAIL_DEFAULT_SENDER'] = os.getenv("MAIL_DEFAULT_SENDER")
MAIL_RECIPIENT = os.getenv("MAIL_RECIPIENT")

mail = Mail(app)

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

    # If any mail config is missing, print error and don't crash
    if not all([app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD'], MAIL_RECIPIENT]):
        print("❌ EMAIL ERROR: Mail credentials missing or not set in environment variables.")
        return jsonify({"success": False, "error": "Mail credentials not configured"}), 500

    try:
        msg = Message(
            subject="📩 New Wedding Inquiry - Parampara",
            recipients=[MAIL_RECIPIENT],
            body=f"""
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
        mail.send(msg)
        print("✅ EMAIL SENT SUCCESSFULLY")
        return jsonify({"success": True}), 200

    except Exception as e:
        print("❌ EMAIL ERROR:", type(e), e)
        return jsonify({"success": False, "error": str(e)}), 500


# ---------------- RUN APP ---------------- #
if __name__ == "__main__":
    # Local testing
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))