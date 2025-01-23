// Set current date as default
document.getElementById("date").valueAsDate = new Date();

function addItem() {
  const itemsContainer = document.getElementById("items-container");
  const itemsGroup = document.createElement("div");
  itemsGroup.className = "items-group";

  const sn = document.getElementsByClassName("items-group").length + 1;

  itemsGroup.innerHTML = `
                <input type="text" value="${sn}" readonly>
                <input type="text" placeholder="Item name" class="item-name">
                <input type="number" placeholder="Price" class="item-price">
                <button class="btn remove-btn" onclick="this.parentElement.remove(); updateItemNumbers(); generateReceipt();">Remove</button>
            `;

  itemsContainer.appendChild(itemsGroup);
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2).replace(".", ":");
}

function generateReceipt() {
  document.getElementById("receiptSellerName").textContent =
    document.getElementById("sellerName").value;
  document.getElementById("receiptBillingTo").textContent =
    document.getElementById("billingTo").value;

  const dateValue = new Date(document.getElementById("date").value);
  const formattedDate = `${dateValue.getDate().toString().padStart(2, "0")}/${(
    dateValue.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dateValue.getFullYear()}`;
  document.getElementById("receiptDate").textContent = formattedDate;

  const items = document.getElementsByClassName("items-group");
  let total = 0;
  let itemsHtml = "";

  for (let i = 0; i < items.length; i++) {
    const itemName = items[i].querySelector(".item-name").value;
    const itemPrice =
      parseFloat(items[i].querySelector(".item-price").value) || 0;
    total += itemPrice;

    itemsHtml += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${itemName}</td>
                        <td>${formatPrice(itemPrice)}</td>
                    </tr>
                `;
  }

  document.getElementById("receiptItems").innerHTML = itemsHtml;
  document.getElementById("receiptTotal").textContent = `TOTAL: ${formatPrice(
    total
  )}`;
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const element = document.getElementById("receipt");
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const imgProps = doc.getImageProperties(imgData);
  const pdfWidth = doc.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  doc.save("receipt.pdf");
}

// Initialize
addItem();
generateReceipt();
