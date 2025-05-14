async function checkNumber() {
  const phone = document.getElementById("phoneInput").value.trim();
  const resultDiv = document.getElementById("result");
  const loading = document.getElementById("loading");

  if (!phone) {
    alert("Please enter a phone number.");
    return;
  }

  resultDiv.innerHTML = "";
  loading.style.display = "block";

  try {
    const [tcpaRes, personRes, reportRes] = await Promise.all([
      fetch(`https://tcpa.api.uspeoplesearch.net/tcpa/v1?x=${phone}`).then(r => r.json()),
      fetch(`https://person.api.uspeoplesearch.net/person/v3?x=${phone}`).then(r => r.json()),
      fetch(`https://tcpa.api.uspeoplesearch.net/tcpa/report?x=${phone}`).then(r => r.json())
    ]);

    const tcpaData = tcpaRes.data || {};
    const personData = personRes.person?.[0] || {};
    const reportData = reportRes.data || {};

    resultDiv.innerHTML = `
      <h3>📞 Phone Info</h3>
      <p><strong>Number:</strong> ${tcpaData.phone_number || "N/A"}</p>
      <p><strong>Carrier:</strong> ${tcpaData.carrier || "N/A"}</p>
      <p><strong>Line Type:</strong> ${tcpaData.line_type || "N/A"}</p>
      <p><strong>State:</strong> ${tcpaData.state || "N/A"}</p>
      <p><strong>DNC National:</strong> ${tcpaData.dnc_national ? "Yes" : "No"}</p>
      <p><strong>DNC State:</strong> ${tcpaData.dnc_state ? "Yes" : "No"}</p>
      
      <h3>🧑 Owner Details</h3>
      <p><strong>Name:</strong> ${personData.name || "N/A"}</p>
      <p><strong>Age:</strong> ${personData.age || "N/A"}</p>
      <p><strong>DOB:</strong> ${personData.dob || "N/A"}</p>
      <p><strong>Address:</strong> ${personData.address || "N/A"}</p>
      <p><strong>City:</strong> ${personData.city || "N/A"}</p>
      <p><strong>State:</strong> ${personData.state || "N/A"}</p>
      <p><strong>ZIP:</strong> ${personData.zip || "N/A"}</p>

      <h3>📊 TCPA Report</h3>
      <p><strong>Litigator:</strong> ${reportData.litigator ? "Yes" : "No"}</p>
      <p><strong>Blacklisted:</strong> ${reportData.blacklisted ? "Yes" : "No"}</p>
    `;
  } catch (err) {
    resultDiv.innerHTML = "<p style='color: red;'>Failed to fetch data. Please try again.</p>";
    console.error(err);
  } finally {
    loading.style.display = "none";
  }
}
