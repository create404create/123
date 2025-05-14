async function checkNumber() {
  const phone = document.getElementById("phoneInput").value.trim();
  const result = document.getElementById("result");
  result.innerHTML = "Loading...";

  if (!phone) {
    result.innerHTML = "Please enter a phone number.";
    return;
  }

  try {
    const tcpaUrl = `https://tcpa.api.uspeoplesearch.net/tcpa/v1?x=${phone}`;
    const personUrl = `https://person.api.uspeoplesearch.net/person/v3?x=${phone}`;
    const reportUrl = `https://tcpa.api.uspeoplesearch.net/tcpa/report?x=${phone}`;

    const [tcpaRes, personRes, reportRes] = await Promise.all([
      fetch(tcpaUrl),
      fetch(personUrl),
      fetch(reportUrl),
    ]);

    if (!tcpaRes.ok || !personRes.ok || !reportRes.ok) {
      throw new Error("API request failed");
    }

    const tcpaData = await tcpaRes.json();
    const personData = await personRes.json();
    const reportData = await reportRes.json();

    result.innerHTML = `
      <strong>TCPA Info:</strong><br />
      Wireless: ${tcpaData.wireless ? "Yes" : "No"}<br />
      Carrier: ${tcpaData.carrier}<br />
      State: ${tcpaData.state}<br />
      DNC National: ${tcpaData.dnc_national ? "Yes" : "No"}<br />
      DNC State: ${tcpaData.dnc_state ? "Yes" : "No"}<br />
      <br /><strong>Person Info:</strong><br />
      Name: ${personData.person?.[0]?.name || "N/A"}<br />
      Age: ${personData.person?.[0]?.age || "N/A"}<br />
      Address: ${personData.person?.[0]?.address || "N/A"}<br />
      City: ${personData.person?.[0]?.city || "N/A"}<br />
      State: ${personData.person?.[0]?.state || "N/A"}<br />
      Zip: ${personData.person?.[0]?.zip || "N/A"}<br />
      <br /><strong>Report Info:</strong><br />
      Score: ${reportData.score || "N/A"}<br />
      Category: ${reportData.category || "N/A"}
    `;
  } catch (error) {
    console.error(error);
    result.innerHTML = "An error occurred while fetching data.";
  }
}
