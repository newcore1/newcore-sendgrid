
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".request-form");
  const cancelBtn = document.getElementById("cancel-btn");
  let verificationCode = "";

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = form.email.value.trim();

    if (!email) {
      alert("يرجى إدخال بريد إلكتروني صالح.");
      return;
    }

    verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    fetch("http://localhost:3000/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, code: verificationCode })
    }).then(res => {
      if (res.ok) {
        document.getElementById("verify-modal").style.display = "flex";
      } else {
        alert("❌ فشل إرسال رمز التحقق. تأكد من أن السيرفر يعمل.");
      }
    });
  });

  cancelBtn.addEventListener("click", function () {
    form.reset();
  });

  document.getElementById("send-code-btn").addEventListener("click", function () {
    const email = form.email.value.trim();
    if (!email) {
      alert("يرجى إدخال بريد إلكتروني.");
      return;
    }
    fetch("http://localhost:3000/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, code: verificationCode })
    }).then(res => {
      if (res.ok) {
        alert("✅ تم إرسال الرمز مرة أخرى إلى بريدك.");
      } else {
        alert("❌ تعذر إعادة إرسال الرمز.");
      }
    });
  });

  document.getElementById("confirm-code-btn").addEventListener("click", function () {
    const inputCode = document.getElementById("verify-code").value.trim();
    if (inputCode === verificationCode) {
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const keymaster = form.keymaster.value.trim();

      const message = {
        content: "**طلب مبرمج جديد - Newcore**\n" +
                `الاسم: ${name}\n` +
                `الإيميل: ${email}\n` +
                `رقم الجوال: ${phone}\n` +
                `رابط Keymaster: ${keymaster}`
      };

      fetch("https://discord.com/api/webhooks/1371918048159862924/I4rqangagZ9EpCpN_qO2NAkHvKOFX7_0o3h3FPFmHO3kJa19iGLfPU3DxUO3Fpe8bCBy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message)
      }).then(res => {
        if (res.ok) {
          alert("✅ تم إرسال الطلب بنجاح!");
          form.reset();
          document.getElementById("verify-modal").style.display = "none";
        } else {
          alert("❌ حدث خطأ أثناء إرسال الطلب.");
        }
      });
    } else {
      alert("❌ رمز التحقق غير صحيح.");
    }
  });

  document.getElementById("cancel-verify-btn").addEventListener("click", function () {
    document.getElementById("verify-modal").style.display = "none";
  });
});
