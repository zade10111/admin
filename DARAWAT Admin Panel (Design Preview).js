//SELLER
let currentManagingProducerId = null;

function toggleSellerManageModal() {
  const modal = document.getElementById("seller-manage-modal");
  const overlay = document.getElementById("seller-manage-overlay");
  if (modal.style.display === "block") {
    modal.style.display = "none";
    overlay.style.display = "none";
  } else {
    modal.style.display = "block";
    overlay.style.display = "block";
  }
}

function handleManageProducer(button) {
  currentManagingProducerId = button.dataset.id;
  const name = button.dataset.name;
  const type = button.dataset.type;
  const location = button.dataset.location;
  const email = button.dataset.email;
  const statusSpan = document.getElementById(`status-${currentManagingProducerId}`);
  const currentStatus = statusSpan ? statusSpan.textContent.trim() : button.dataset.status;
  const products = JSON.parse(button.dataset.products || '[]');

  document.getElementById("seller-modal-title").textContent = `Manage: ${name}`;

  const contentContainer = document.getElementById("seller-manage-content");
  contentContainer.innerHTML = `
    <div style="background: var(--bg); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--line);">
      <strong>Business Info:</strong> ${type} • Location: ${location}<br>
      <small class="meta">Contact Email: ${email}</small>
    </div>

    <!-- 1. Suspend / Status Control -->
    <div style="border: 1px solid var(--line); padding: 12px; border-radius: 8px;">
      <strong style="display:block; margin-bottom: 6px;">Account Access & Suspension Status</strong>
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span class="meta">Current State: <span id="modal-status-label" class="status-tag ${currentStatus === 'Suspended' ? 'tag-pending' : 'tag-verified'}">${currentStatus}</span></span>
        <button type="button" id="suspend-toggle-btn" class="btn-sm ${currentStatus === 'Suspended' ? 'btn-green' : 'btn-red'}" onclick="toggleProducerSuspension()">
          ${currentStatus === 'Suspended' ? 'Activate / Unsuspend Account' : 'Suspend Producer Account'}
        </button>
      </div>
    </div>

    <!-- 2. Example Products Preview -->
    <div style="border: 1px solid var(--line); padding: 12px; border-radius: 8px;">
      <strong style="display:block; margin-bottom: 6px;">Example Products Listed (${products.length})</strong>
      <ul style="margin: 0; padding-left: 18px; color: var(--text);">
        ${products.map(p => `<li style="margin-bottom: 4px;">${p}</li>`).join('')}
      </ul>
    </div>

    <!-- 3. Message / Notification Sender -->
    <div style="border: 1px solid var(--line); padding: 12px; border-radius: 8px;">
      <strong style="display:block; margin-bottom: 6px;">Send Direct Message / Notification to Seller</strong>
      <textarea id="seller-message-input" class="form-textarea" placeholder="Type notification or policy warning message here..." style="min-height: 60px; font-size: 12px;"></textarea>
      <button type="button" class="btn-sm btn-outline" style="margin-top: 6px;" onclick="sendSellerMessage('${email}')">Send Notification Message</button>
    </div>
  `;

  document.getElementById("seller-save-btn").onclick = function() {
    alert(`Updates for ${name} saved successfully.`);
    toggleSellerManageModal();
  };

  toggleSellerManageModal();
}

function toggleProducerSuspension() {
  const statusLabel = document.getElementById("modal-status-label");
  const suspendBtn = document.getElementById("suspend-toggle-btn");
  const tableStatusSpan = document.getElementById(`status-${currentManagingProducerId}`);

  if (statusLabel.textContent.trim() === "Suspended") {
    statusLabel.textContent = "Verified";
    statusLabel.className = "status-tag tag-verified";
    suspendBtn.textContent = "Suspend Producer Account";
    suspendBtn.className = "btn-sm btn-red";
    if (tableStatusSpan) {
      tableStatusSpan.textContent = "Verified";
      tableStatusSpan.className = "status-tag tag-verified";
    }
  } else {
    statusLabel.textContent = "Suspended";
    statusLabel.className = "status-tag tag-pending";
    suspendBtn.textContent = "Activate / Unsuspend Account";
    suspendBtn.className = "btn-sm btn-green";
    if (tableStatusSpan) {
      tableStatusSpan.textContent = "Suspended";
      tableStatusSpan.className = "status-tag tag-pending";
    }
  }
}

function sendSellerMessage(email) {
  const msgInput = document.getElementById("seller-message-input");
  if (!msgInput.value.trim()) {
    alert("Please enter a message before sending.");
    return;
  }
  alert(`Notification message successfully dispatched to seller (${email}):\n\n"${msgInput.value}"`);
  msgInput.value = "";
}




function toggleUserModal() {
  const modal = document.getElementById("user-edit-modal");
  const overlay = document.getElementById("user-modal-overlay");
  if (modal.style.display === "block") {
    modal.style.display = "none";
    overlay.style.display = "none";
  } else {
    modal.style.display = "block";
    overlay.style.display = "block";
  }
}

// Toggle visibility of suspension days input based on status selection
function toggleSuspensionDays(status) {
  const daysGroup = document.getElementById("suspension-days-group");
  if (status === "Suspended") {
    daysGroup.style.display = "block";
  } else {
    daysGroup.style.display = "none";
    document.getElementById("edit-user-days").value = "";
  }
}

function openEditUserModal(rowId, username, fullName, email, role, status) {
  document.getElementById("edit-user-row-id").value = rowId;
  // Map incoming statuses safely to Active or Suspended
  const normalizedStatus = (status === "Suspended") ? "Suspended" : "Active";
  document.getElementById("edit-user-status").value = normalizedStatus;
  document.getElementById("edit-user-days").value = "";
  document.getElementById("edit-user-message").value = "";
  
  toggleSuspensionDays(normalizedStatus);
  toggleUserModal();
}

function saveUserChanges(event) {
  event.preventDefault();
  const rowId = document.getElementById("edit-user-row-id").value;
  const newStatus = document.getElementById("edit-user-status").value;
  const suspensionDays = document.getElementById("edit-user-days").value;
  const notificationMsg = document.getElementById("edit-user-message").value;

  const statusTag = document.getElementById(`u-status-tag-${rowId}`);
  
  statusTag.className = "status-tag";
  if (newStatus === "Suspended") {
    statusTag.textContent = suspensionDays ? `Suspended (${suspensionDays}d)` : "Suspended";
    statusTag.classList.add("tag-pending");
    statusTag.style.background = "rgba(239, 68, 68, 0.1)";
    statusTag.style.color = "var(--red)";
  } else {
    statusTag.textContent = "Active";
    statusTag.classList.add("tag-active");
    statusTag.style.background = "";
    statusTag.style.color = "";
  }

  // Build feedback alert message
  let alertText = newStatus === "Suspended" ? "User account has been suspended." : "User account is now active.";
  if (newStatus === "Suspended" && suspensionDays) {
    alertText += ` Duration: ${suspensionDays} day(s).`;
  }
  if (notificationMsg.trim() !== "") {
    alertText += ` Notification message successfully sent to the user.`;
  }

  alert(alertText);
  toggleUserModal();
}

//FOR PRODUCTS
function filterListingType(type) {
        // Highlight active filter button
        document.querySelectorAll('#tab-products .table-toolbar button[id^="listing-type-"]').forEach(btn => {
          btn.className = "btn-sm btn-outline";
        });
        const activeBtn = document.getElementById('listing-type-' + type);
        if (activeBtn) activeBtn.className = "btn-sm btn-green";

        // Show/Hide product rows based on the selected type attribute
        const rows = document.querySelectorAll('#listings-table-body tr');
        rows.forEach(row => {
          if (type === 'all' || row.dataset.type === type) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      }


//REPORT

      function resolveReport(reportId) {
  // Update UI status tag to Resolved / Success
  const statusTag = document.getElementById(`report-status-${reportId}`);
  if (statusTag) {
    statusTag.className = "status-tag tag-verified";
    statusTag.textContent = "Resolved";
  }
  
  // Optionally remove or disable buttons after resolution
  const row = document.getElementById(`report-row-${reportId}`);
  if (row) {
    const actionCell = row.querySelector("td:last-child");
    actionCell.innerHTML = '<span style="font-size:12px; color:var(--g); font-weight:700;">✓ Handled</span>';
  }

  alert(`Report ${reportId} has been successfully resolved and closed.`);
}

function dismissReport(reportId) {
  // Update UI status tag to Dismissed
  const statusTag = document.getElementById(`report-status-${reportId}`);
  if (statusTag) {
    statusTag.className = "status-tag";
    statusTag.style.background = "#e2e8f0";
    statusTag.style.color = "#475569";
    statusTag.textContent = "Dismissed";
  }

  const row = document.getElementById(`report-row-${reportId}`);
  if (row) {
    const actionCell = row.querySelector("td:last-child");
    actionCell.innerHTML = '<span style="font-size:12px; color:var(--muted); font-weight:700;">Dismissed</span>';
  }

  alert(`Report ${reportId} has been dismissed.`);
}


//Map
// Global variable to hold the map instance
let leafletMap = null;
let mapMarkersLayer = [];

function initLeafletMap() {
  // Prevent re-initialization if already loaded
  if (leafletMap) return;

  // Initialize map centered roughly over a region (e.g., coordinates set to [14.5995, 120.9842] for Manila as an example baseline)
  leafletMap = L.map('leaflet-map-view').setView([14.5995, 120.9842], 12);

  // Add OpenStreetMap tile layer
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(leafletMap);

  // Sample data points matching your feed list
  const locations = [
    { name: "Maria Clara Farm", type: "Producer", lat: 14.6095, lng: 120.9742, desc: "Brgy. 3 • Poultry & Livestock" },
    { name: "Elmer Ramos", type: "User (Buyer)", lat: 14.5895, lng: 120.9942, desc: "Barangay 1 (Poblacion) • Active Buyer" },
    { name: "San Jose Highland Agro", type: "Producer", lat: 14.6195, lng: 121.0042, desc: "Brgy. 5 • Organic Produce & Fruits" }
  ];

  // Plot markers onto the map
  locations.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng]).addTo(leafletMap);
    marker.bindPopup(`<b>${loc.name}</b><br><span style="font-size:11px; color:#666;">${loc.desc}</span>`);
    mapMarkersLayer.push({ marker, type: loc.type });
  });
}

// Automatically trigger map initialization when the user clicks/views the Locations tab
// (If your tab switching logic has a trigger function, call initLeafletMap() inside it)
document.addEventListener("DOMContentLoaded", function() {
  // Small timeout ensures the DOM container is rendered before Leaflet measures dimensions
  setTimeout(initLeafletMap, 300);
});





// Function to make the map go full screen
function expandMapFullScreen() {
  const mapContainer = document.querySelector('.map-layout-grid');
  const leafletBox = document.querySelector('.leaflet-wrapper-box');
  const feedBox = document.querySelector('.map-feed-list-box');
  const shrinkBtn = document.getElementById('shrink-map-btn');
  const expandBtn = document.getElementById('fullscreen-map-btn');

  // Apply fixed full-screen dimensions across viewport
  mapContainer.style.position = 'fixed';
  mapContainer.style.top = '0';
  mapContainer.style.left = '0';
  mapContainer.style.width = '100vw';
  mapContainer.style.height = '100vh';
  mapContainer.style.zIndex = '9999';
  mapContainer.style.background = '#ffffff';
  mapContainer.style.padding = '20px';
  mapContainer.style.margin = '0';
  mapContainer.style.boxSizing = 'border-box';
  mapContainer.style.gridTemplateColumns = '3fr 1fr';
  
  leafletBox.style.height = 'calc(100vh - 40px)';
  feedBox.style.maxHeight = 'calc(100vh - 40px)';
  
  // Toggle visibility of buttons
  shrinkBtn.style.display = 'inline-block';
  expandBtn.style.display = 'none';

  // Refresh Leaflet so tiles don't grey out or stretch wrong
  if (window.leafletMapInstance) {
    setTimeout(() => {
      window.leafletMapInstance.invalidateSize();
    }, 100);
  }
}

// Function to shrink the map back down to normal size
function shrinkMapNormal() {
  const mapContainer = document.querySelector('.map-layout-grid');
  const leafletBox = document.querySelector('.leaflet-wrapper-box');
  const feedBox = document.querySelector('.map-feed-list-box');
  const shrinkBtn = document.getElementById('shrink-map-btn');
  const expandBtn = document.getElementById('fullscreen-map-btn');

  // Revert back to original layout settings
  mapContainer.style.position = 'static';
  mapContainer.style.width = '100%';
  mapContainer.style.height = 'auto';
  mapContainer.style.zIndex = 'auto';
  mapContainer.style.background = 'transparent';
  mapContainer.style.padding = '0';
  mapContainer.style.margin = '15px 0 0 0';
  mapContainer.style.gridTemplateColumns = '2fr 1fr';
  
  leafletBox.style.height = '400px';
  feedBox.style.maxHeight = '400px';
  
  // Toggle visibility of buttons back
  shrinkBtn.style.display = 'none';
  expandBtn.style.display = 'inline-block';

  // Refresh Leaflet to restore regular dimensions
  if (window.leafletMapInstance) {
    setTimeout(() => {
      window.leafletMapInstance.invalidateSize();
    }, 100);
  }
}





// Toggle Add Location Modal Visibility
function toggleLocationModal() {
  const modal = document.getElementById("location-add-modal");
  const overlay = document.getElementById("location-modal-overlay");
  
  if (modal.style.display === "block") {
    modal.style.display = "none";
    overlay.style.display = "none";
  } else {
    document.getElementById("add-location-form").reset();
    document.getElementById("new-loc-district").value = "San Jose de Buenavista";
    
    modal.style.display = "block";
    overlay.style.display = "block";
  }
}

// Handle Form Submission and Auto-Calculate Sellers
function saveNewLocation(event) {
  event.preventDefault();

  const name = document.getElementById("new-loc-name").value;
  const district = document.getElementById("new-loc-district").value;
  const coordinator = document.getElementById("new-loc-coordinator").value;

  // Automatically count rows from the Producers tab table[cite: 1]
  const producerRows = document.querySelectorAll("#tab-producers tbody tr");
  let autoSellerCount = 0;

  producerRows.forEach(row => {
    const locationText = row.cells[2] ? row.cells[2].textContent.toLowerCase() : "";
    if (locationText.includes(name.toLowerCase()) || locationText.includes("brgy")) {
      autoSellerCount++;
    }
  });

  // Fallback baseline if no direct match is found in the mock data
  if (autoSellerCount === 0) {
    autoSellerCount = Math.floor(Math.random() * 15) + 10; 
  }

  // Target the Locations table body[cite: 1]
  const tableBody = document.querySelector("#tab-barangays tbody");

  // Create new table row element with the auto-synced count
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td><b>${name}</b></td>
    <td>${district}</td>
    <td>${autoSellerCount} Sellers</td>
    <td>${coordinator}</td>
    <td><span class="status-tag tag-active">Active Hub</span></td>
  `;

  // Append new row to table
  tableBody.appendChild(newRow);

  alert(`Successfully added location "${name}" with ${autoSellerCount} auto-synced active sellers!`);
  toggleLocationModal();
}



// Live filter function for Barangay and Municipality search
function filterLocationsTable() {
  const query = document.getElementById("location-search-input").value.toLowerCase();
  const rows = document.querySelectorAll("#locations-data-table tbody tr");

  rows.forEach(row => {
    const barangayText = row.cells[0] ? row.cells[0].textContent.toLowerCase() : "";
    const districtText = row.cells[1] ? row.cells[1].textContent.toLowerCase() : "";

    // Check if either the barangay name or municipality text matches what the user typed
    if (barangayText.includes(query) || districtText.includes(query)) {
      row.style.display = ""; // Show row
    } else {
      row.style.display = "none"; // Hide row
    }
  });
}

// Predefined database of available barangays (20 Examples)
const barangayDatabase = {
  "Barangay 1 (Poblacion)": { municipality: "San Jose de Buenavista", coordinator: "Kagawad Benitez" },
  "Barangay 2": { municipality: "San Jose de Buenavista", coordinator: "Kapitan Arnel Gomez" },
  "Barangay 3 (Centro)": { municipality: "San Jose de Buenavista", coordinator: "Kapitan Dela Rosa" },
  "Barangay 4": { municipality: "San Jose de Buenavista", coordinator: "Kagawad Maria Tan" },
  "Barangay 5 (Mountain Slope)": { municipality: "San Jose de Buenavista", coordinator: "Ate Linda Cruz" },
  "Barangay 6 (Coastal)": { municipality: "San Jose de Buenavista", coordinator: "Kagawad Roberto Reyes" },
  "Barangay 7 (Badiang)": { municipality: "San Jose de Buenavista", coordinator: "Kagawad Lolit Alcantara" },
  "Barangay 8 (Atabay)": { municipality: "San Jose de Buenavista", coordinator: "Kapitan Ramon Gatchalian" },
  "Barangay 9 (Barasan)": { municipality: "San Jose de Buenavista", coordinator: "Kagawad Nestor Pajarito" },
  "Barangay 10 (San Pedro)": { municipality: "San Jose de Buenavista", coordinator: "Ate Marites Villar" },
  "Barangay 11 (Magcalon)": { municipality: "San Jose de Buenavista", coordinator: "Kagawad Efren Zaldivar" },
  "Barangay 12 (Cansadan)": { municipality: "San Jose de Buenavista", coordinator: "Kapitan Jun Labao" },
  "Barangay 13 (Durog)": { municipality: "San Jose de Buenavista", coordinator: "Kagawad Nena Macahig" },
  "Barangay 14 (Igot)": { municipality: "San Jose de Buenavista", coordinator: "Ate Jocelyn Tingson" },
  "Barangay 15 (Malandog)": { municipality: "Hamtic", coordinator: "Kapitan Berting Eiman" },
  "Barangay 16 (Poblacion Ilawod)": { municipality: "Hamtic", coordinator: "Kagawad Susing Gicala" },
  "Barangay 17 (Bantique)": { municipality: "Sibalom", coordinator: "Kapitan Dodong Oñate" },
  "Barangay 18 (Cala-an)": { municipality: "Sibalom", coordinator: "Kagawad Inday Salcedo" },
  "Barangay 19 (Poblacion)": { municipality: "Patnongon", coordinator: "Kapitan Tonio Encarnacion" },
  "Barangay 20 (Agbulan)": { municipality: "San Remigio", coordinator: "Kagawad Pacing Mosquera" }
};

// Handle live typing to show matching suggestions
function handleBarangayTyping(query) {
  const suggestionBox = document.getElementById("barangay-suggestions");
  const districtInput = document.getElementById("new-loc-district");
  const coordinatorInput = document.getElementById("new-loc-coordinator");

  // Clear autofilled fields if user clears or changes typing significantly
  if (!barangayDatabase[query]) {
    districtInput.value = "";
    coordinatorInput.value = "";
  }

  if (!query.trim()) {
    suggestionBox.style.display = "none";
    return;
  }

  // Filter matching barangays based on what the user typed
  const matches = Object.keys(barangayDatabase).filter(b => 
    b.toLowerCase().includes(query.toLowerCase())
  );

  if (matches.length > 0) {
    let html = "";
    matches.forEach(match => {
      html += `<div onclick="selectBarangay('${match}')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0; font-size: 13px;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='#fff'">${match}</div>`;
    });
    suggestionBox.innerHTML = html;
    suggestionBox.style.display = "block";
  } else {
    suggestionBox.style.display = "none";
  }
}

// Select a barangay from the suggestion box and auto-fill details
function selectBarangay(barangayName) {
  document.getElementById("new-loc-name").value = barangayName;
  document.getElementById("barangay-suggestions").style.display = "none";

  // Auto-fill municipality and coordinator
  if (barangayDatabase[barangayName]) {
    document.getElementById("new-loc-district").value = barangayDatabase[barangayName].municipality;
    document.getElementById("new-loc-coordinator").value = barangayDatabase[barangayName].coordinator;
  }
}

// Reset modal state when closed
function toggleLocationModal() {
  const modal = document.getElementById("location-add-modal");
  const overlay = document.getElementById("location-modal-overlay");
  
  if (modal.style.display === "block") {
    modal.style.display = "none";
    overlay.style.display = "none";
  } else {
    document.getElementById("add-location-form").reset();
    document.getElementById("barangay-suggestions").style.display = "none";
    modal.style.display = "block";
    overlay.style.display = "block";
  }
}

// Handle Form Submission and Auto-Calculate Sellers
function saveNewLocation(event) {
  event.preventDefault();

  const name = document.getElementById("new-loc-name").value;
  const district = document.getElementById("new-loc-district").value;
  const coordinator = document.getElementById("new-loc-coordinator").value;

  // Automatically count active sellers based on registered producers table[cite: 1]
  const producerRows = document.querySelectorAll("#tab-producers tbody tr");
  let autoSellerCount = 0;

  producerRows.forEach(row => {
    const locationText = row.cells[2] ? row.cells[2].textContent.toLowerCase() : "";
    if (locationText.includes(name.toLowerCase()) || locationText.includes("brgy")) {
      autoSellerCount++;
    }
  });

  if (autoSellerCount === 0) {
    autoSellerCount = Math.floor(Math.random() * 12) + 8; 
  }

  const tableBody = document.querySelector("#tab-barangays tbody");

  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td><b>${name}</b></td>
    <td>${district}</td>
    <td>${autoSellerCount} Sellers</td>
    <td>${coordinator}</td>
    <td><span class="status-tag tag-active">Active Hub</span></td>
  `;

  tableBody.appendChild(newRow);

  alert(`Successfully added ${name}!`);
  toggleLocationModal();
}




// Toggle Modals for Add/Edit Category
function toggleCategoryModal(mode) {
  const modal = document.getElementById(mode === 'add' ? 'category-add-modal' : 'category-edit-modal');
  const overlay = document.getElementById(mode === 'add' ? 'category-add-overlay' : 'category-edit-overlay');
  
  if (modal.style.display === "block") {
    modal.style.display = "none";
    overlay.style.display = "none";
  } else {
    modal.style.display = "block";
    overlay.style.display = "block";
  }
}

// Open Edit Modal with prefilled row data
function openEditCategoryModal(index, name, slug) {
  document.getElementById('edit-cat-index').value = index;
  document.getElementById('edit-cat-name').value = name;
  document.getElementById('edit-cat-slug').value = slug;
  toggleCategoryModal('edit');
}

// Handle Saving a New Category
function saveNewCategory(event) {
  event.preventDefault();
  const name = document.getElementById('new-cat-name').value;
  const slug = document.getElementById('new-cat-slug').value;
  
  const tbody = document.querySelector('#categories-table tbody');
  const newIndex = tbody.rows.length;
  
  const newRow = document.createElement('tr');
  newRow.setAttribute('data-index', newIndex);
  newRow.innerHTML = `
    <td><b>${name}</b></td>
    <td>${slug}</td>
    <td>0</td>
    <td><span class="status-tag tag-active">Active</span></td>
    <td><button class="btn-sm btn-outline" onclick="openEditCategoryModal(${newIndex}, '${name}', '${slug}')">Edit</button></td>
  `;
  
  tbody.appendChild(newRow);
  document.getElementById('add-category-form').reset();
  toggleCategoryModal('add');
  alert('Category added successfully!');
}

// Handle Saving Edits to an Existing Category
function saveEditedCategory(event) {
  event.preventDefault();
  const index = document.getElementById('edit-cat-index').value;
  const name = document.getElementById('edit-cat-name').value;
  const slug = document.getElementById('edit-cat-slug').value;
  
  const row = document.querySelector(`#categories-table tbody tr[data-index="${index}"]`);
  if (row) {
    row.cells[0].innerHTML = `<b>${name}</b>`;
    row.cells[1].textContent = slug;
    // Keep edit button reference functional with updated parameters
    row.cells[4].innerHTML = `<button class="btn-sm btn-outline" onclick="openEditCategoryModal(${index}, '${name}', '${slug}')">Edit</button>`;
  }
  
  toggleCategoryModal('edit');
  alert('Category updated successfully!');
}






// Initialize default reports if localStorage is empty
let savedReports = JSON.parse(localStorage.getItem("darawat_generated_reports")) || [
  { title: "Q1 2026 Producer Yield Summary", type: "Financial / Yield", date: "Apr 01, 2026", size: "2.4 MB" },
  { title: "Marketplace User Engagement Brief", type: "Analytics", date: "Mar 15, 2026", size: "1.1 MB" }
];

// Auto-run render when the page loads
document.addEventListener("DOMContentLoaded", () => {
  renderReportsTable();
});

function renderReportsTable(filterQuery = "") {
  const tableBody = document.querySelector("#reports-analytics-table tbody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  // Filter reports based on search query
  const filteredReports = savedReports.filter(report => 
    report.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    report.type.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (filteredReports.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--muted); padding: 20px;">No matching reports found.</td></tr>`;
    return;
  }

  filteredReports.forEach((report, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><b>${report.title}</b></td>
      <td>${report.type}</td>
      <td>${report.date}</td>
      <td>${report.size}</td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button class="btn-sm btn-outline" onclick="downloadReport('${report.title}')">Download PDF</button>
          <button class="btn-sm btn-red" onclick="deleteReport(${index})" style="padding: 2px 8px;">✕</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function generateNewReport() {
  const reportTitle = prompt("Enter Report Title (e.g., Q2 2026 Agricultural Yield & Sales):", "Q2 2026 Producer Yield Summary");
  if (!reportTitle || reportTitle.trim() === "") return;

  let reportType = "Analytics / Summary";
  const lowerTitle = reportTitle.toLowerCase();
  if (lowerTitle.includes("financial") || lowerTitle.includes("yield") || lowerTitle.includes("sales")) {
    reportType = "Financial / Yield";
  } else if (lowerTitle.includes("security") || lowerTitle.includes("audit")) {
    reportType = "Security Audit";
  }

  const options = { month: 'short', day: '2-digit', year: 'numeric' };
  const currentDate = new Date().toLocaleDateString('en-US', options);
  const fileSize = (Math.random() * (3.5 - 1.0) + 1.0).toFixed(1) + " MB";

  const newReport = {
    title: reportTitle.trim(),
    type: reportType,
    date: currentDate,
    size: fileSize
  };

  // Add to top of array, update localStorage, and re-render
  savedReports.unshift(newReport);
  localStorage.setItem("darawat_generated_reports", JSON.stringify(savedReports));
  renderReportsTable();

  alert(`Success: "${newReport.title}" has been successfully generated and archived.`);
}

function downloadReport(title) {
  alert(`Downloading PDF document for: "${title}"...\nPlease check your browser downloads folder.`);
}

function deleteReport(index) {
  if (confirm("Are you sure you want to delete this generated report record?")) {
    savedReports.splice(index, 1);
    localStorage.setItem("darawat_generated_reports", JSON.stringify(savedReports));
    renderReportsTable();
  }
}

function filterReportsTable(query) {
  renderReportsTable(query);
}








// Open the Add Admin Modal
function openAddAdminModal() {
    const modal = document.getElementById('addAdminModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Close the Add Admin Modal
function closeAddAdminModal() {
    const modal = document.getElementById('addAdminModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Process form submission and insert row into table
function addAdmin(event) {
    event.preventDefault(); // Prevent page reload

    // Grab input values
    const name = document.getElementById('adminName').value.trim();
    const email = document.getElementById('adminEmail').value.trim();
    const role = document.getElementById('adminRole').value;

    if (!name || !email) {
        alert('Please fill out all fields.');
        return;
    }

    // Target the table body
    const tableBody = document.getElementById('adminTableBody');
    
    // Create new table row matching your HTML structure
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><b>${name}</b></td>
        <td>${email}</td>
        <td>${role}</td>
        <td>Just now</td>
        <td><span class="status-tag tag-active">Online</span></td>
    `;

    // Append to table
    tableBody.appendChild(newRow);

    // Reset form and close modal
    event.target.reset();
    closeAddAdminModal();
    
    alert('Administrator successfully added!');
}




// Function to toggle the New Broadcast Modal
function toggleBroadcastModal() {
  let modal = document.getElementById("broadcast-modal");
  let overlay = document.getElementById("broadcast-modal-overlay");

  if (!modal) {
    // Dynamically inject the Broadcast Modal if it doesn't exist yet in the DOM
    const modalHTML = `
      <div class="mobile-drawer-overlay" id="broadcast-modal-overlay" onclick="toggleBroadcastModal()" style="display:none; z-index: 2500;"></div>
      <div id="broadcast-modal" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:90%; max-width:460px; background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.15); z-index:3000; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--line); padding-bottom:10px; margin-bottom:15px;">
          <h3 style="margin:0; font-size:16px; color: var(--g);">Create New Broadcast Notification</h3>
          <button onclick="toggleBroadcastModal()" style="border:0; background:transparent; font-size:16px; cursor:pointer;">✕</button>
        </div>
        <form id="broadcast-form" onsubmit="submitBroadcast(event)" style="display:flex; flex-direction:column; gap:12px; font-size:13px;">
          <div class="form-group" style="margin:0;">
            <label>Message Title</label>
            <input type="text" id="broadcast-title" class="form-input" placeholder="e.g., Flash Weather Advisory" required>
          </div>
          <div class="form-group" style="margin:0;">
            <label>Target Audience</label>
            <select id="broadcast-audience" class="form-input">
              <option value="All Users & Producers">All Users & Producers</option>
              <option value="All Active Sellers">All Active Sellers</option>
              <option value="Buyers Only">Buyers Only</option>
            </select>
          </div>
          <div class="form-group" style="margin:0;">
            <label>Broadcast Message Body</label>
            <textarea id="broadcast-body" class="form-input" rows="3" placeholder="Write notification content here..." required></textarea>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px; border-top:1px solid var(--line); padding-top:12px;">
            <button type="button" class="btn-sm btn-outline" onclick="toggleBroadcastModal()">Cancel</button>
            <button type="submit" class="btn-sm btn-green">Send Broadcast</button>
          </div>
        </form>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modal = document.getElementById("broadcast-modal");
    overlay = document.getElementById("broadcast-modal-overlay");
  }

  if (modal.style.display === "block") {
    modal.style.display = "none";
    overlay.style.display = "none";
  } else {
    document.getElementById("broadcast-form").reset();
    modal.style.display = "block";
    overlay.style.display = "block";
  }
}

// Function to handle sending/saving the broadcast entry
function submitBroadcast(event) {
  event.preventDefault();

  const title = document.getElementById("broadcast-title").value;
  const audience = document.getElementById("broadcast-audience").value;
  
  // Format current date and time simulation
  const now = new Date();
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const dateStr = now.toLocaleDateString('en-US', options);
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateTimeFormatted = `${dateStr} • ${timeStr}`;

  // Estimate reach count based on target selection
  let reachCount = audience.includes("Sellers") ? "186 Sellers" : "1,248 Users";

  // Locate the notifications table body
  const notificationsTable = document.querySelector("#tab-notifications .data-table tbody");

  if (notificationsTable) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td><b>${title}</b></td>
      <td>${audience}</td>
      <td>${dateTimeFormatted}</td>
      <td>${reachCount}</td>
      <td><span class="status-tag tag-verified">Delivered</span></td>
    `;
    // Insert new broadcast at the top of the list
    notificationsTable.insertBefore(newRow, notificationsTable.firstChild);
  }

  alert(`Broadcast "${title}" successfully sent to ${audience}!`);
  toggleBroadcastModal();
}









  const currentAdmin = { name: "Maria Santos", role: "System Administrator", email: "m.santos@darawat.ph", initials: "MS", loginTime: "Today at 08:30 AM" };
      const onlineAdmins = [
        { name: "Maria Santos", role: "System Administrator", initials: "MS", bg: "#0abd64", current: true },
        { name: "Juan Reyes", role: "Moderator", initials: "JR", bg: "#0072ce", current: false },
        { name: "Atty. Clara Villar", role: "Legal & Compliance", initials: "CV", bg: "#8a5a00", current: false }
      ];

      document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("admin-name").textContent = currentAdmin.name;
        document.getElementById("admin-role").textContent = currentAdmin.role;
        document.getElementById("admin-avatar").textContent = currentAdmin.initials;
        document.getElementById("admin-email").textContent = currentAdmin.email;
        document.getElementById("admin-last-login").textContent = "Logged in: " + currentAdmin.loginTime;
        document.getElementById("welcome-heading").textContent = `Welcome back, ${currentAdmin.name.split(' ')[0]}!`;
        renderOnlineAdmins();
      });

      function renderOnlineAdmins() {
        const stackContainer = document.getElementById("stack-container");
        const listContainer = document.getElementById("online-admins-list");
        document.getElementById("online-count-badge").textContent = `${onlineAdmins.length} Online`;
        stackContainer.innerHTML = "";
        listContainer.innerHTML = "";

        onlineAdmins.forEach(admin => {
          const avatarEl = document.createElement("div");
          avatarEl.className = "stack-avatar";
          avatarEl.style.backgroundColor = admin.bg;
          avatarEl.innerHTML = `${admin.initials}<span class="status-dot"></span>`;
          stackContainer.appendChild(avatarEl);

          const itemEl = document.createElement("div");
          itemEl.className = "admin-online-item";
          itemEl.innerHTML = `
            <div class="admin-online-avatar" style="background-color: ${admin.bg}">${admin.initials}<span class="status-dot"></span></div>
            <div class="admin-online-info"><b>${admin.name}</b><small>${admin.role}</small></div>
          `;
          listContainer.appendChild(itemEl);
        });
      }

      function toggleDropdown() { document.getElementById("admin-menu").classList.toggle("show"); }
      function toggleOnlineAdminsDropdown() { document.getElementById("online-admins-menu").classList.toggle("show"); }
      
      function toggleAdminModal() {
        const modal = document.getElementById("admin-profile-modal");
        const overlay = document.getElementById("admin-modal-overlay");
        
        if (modal.style.display === "block") {
          modal.style.display = "none";
          overlay.style.display = "none";
        } else {
          document.getElementById("modal-admin-name").value = currentAdmin.name;
          document.getElementById("modal-admin-email").value = currentAdmin.email;
          document.getElementById("modal-admin-pass").value = "";
          
          modal.style.display = "block";
          overlay.style.display = "block";
        }
      }

      function saveLoggedAdminProfile(event) {
        event.preventDefault();
        
        const updatedName = document.getElementById("modal-admin-name").value;
        const updatedEmail = document.getElementById("modal-admin-email").value;
        const updatedPass = document.getElementById("modal-admin-pass").value;
        
        currentAdmin.name = updatedName;
        currentAdmin.email = updatedEmail;
        
        const initials = updatedName.split(' ').map(n => n[0]).join('').toUpperCase();
        currentAdmin.initials = initials;
        
        document.getElementById("admin-name").textContent = updatedName;
        document.getElementById("admin-email").textContent = updatedEmail;
        document.getElementById("admin-avatar").textContent = initials;
        document.getElementById("welcome-heading").textContent = `Welcome back, ${updatedName.split(' ')[0]}!`;
        
        if (updatedPass.trim() !== "") {
          if (updatedPass.length < 6) {
            alert("Error: Password must be at least 6 characters long.");
            return;
          }
          alert("Profile and new password updated successfully!");
        } else {
          alert("Profile updated successfully!");
        }
        
        toggleAdminModal();
      }

      function toggleMobileDrawer() {
        document.getElementById("mobile-drawer").classList.toggle("show");
        document.getElementById("drawer-overlay").classList.toggle("show");
      }

      window.onclick = function(event) {
        if (!event.target.closest('.admin-profile-wrapper')) {
          const dropdown = document.getElementById("admin-menu");
          if (dropdown) dropdown.classList.remove('show');
        }
        if (!event.target.closest('.online-admins-wrapper')) {
          const adminsDropdown = document.getElementById("online-admins-menu");
          if (adminsDropdown) adminsDropdown.classList.remove('show');
        }
      }

      function switchTab(tabId) {
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.mobile-nav-item').forEach(b => b.classList.remove('active'));
        
        const targetPanel = document.getElementById('tab-' + tabId);
        if (targetPanel) targetPanel.classList.add('active');

        const activeBtn = document.getElementById('btn-' + tabId);
        if (activeBtn) activeBtn.classList.add('active');

        const drawerBtn = document.getElementById('drawer-btn-' + tabId);
        if (drawerBtn) drawerBtn.classList.add('active');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      function switchSettingsTab(settingsPaneId) {
        document.querySelectorAll('.settings-section-pane').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));

        const targetPane = document.getElementById('st-pane-' + settingsPaneId);
        if (targetPane) targetPane.classList.add('active');

        const targetBtn = document.getElementById('st-btn-' + settingsPaneId);
        if (targetBtn) targetBtn.classList.add('active');
      }

      function toggleProducerModal() {
  const modal = document.getElementById("producer-details-modal");
  const overlay = document.getElementById("producer-modal-overlay");
  
  if (modal.style.display === "block") {
    modal.style.display = "none";
    overlay.style.display = "none";
  } else {
    modal.style.display = "block";
    overlay.style.display = "block";
  }
}

function handleViewClick(button) {
  const producer = {
    id: button.dataset.id,
    name: button.dataset.name,
    owner: button.dataset.owner,
    barangay: button.dataset.barangay,
    idType: button.dataset.idtype,
    faceMatch: button.dataset.facematch,
    contact: button.dataset.contact,
    email: button.dataset.email,
    status: button.dataset.status
  };

  const contentContainer = document.getElementById("producer-modal-content");
  
  contentContainer.innerHTML = `
    <div style="background: var(--bg); padding: 12px; border-radius: 8px; border: 1px solid var(--line);">
      <strong style="font-size: 14px; color: var(--text);">${producer.name}</strong>
      <div style="color: var(--muted); font-size: 11px;">Application Reference: ${producer.id}</div>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 4px;">
      <div><strong>Owner / Applicant:</strong><br>${producer.owner || 'N/A'}</div>
      <div><strong>Location / Barangay:</strong><br>${producer.barangay}</div>
      <div><strong>Email Address:</strong><br>${producer.email}</div>
      <div><strong>Contact Number:</strong><br>${producer.contact}</div>
      <div><strong>ID Type Submitted:</strong><br>${producer.idType}</div>
      <div><strong>Biometric Face Match:</strong><br><span class="status-tag tag-active">${producer.faceMatch}</span></div>
    </div>
    <div style="margin-top: 8px;">
      <strong>Submitted Documents Preview (Click to Enlarge):</strong>
      <div style="display: flex; gap: 8px; margin-top: 6px;">
        <div onclick="openFullScreenImage('ID Front Preview', 'https://via.placeholder.com/800x500?text=ID+Front+Full+View')" style="flex:1; background:#f0f4f1; border: 1px dashed var(--line); padding: 20px; text-align:center; border-radius:6px; color: var(--muted); font-size:11px; cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='#e2ebe3'" onmouseout="this.style.background='#f0f4f1'">🔍 ID Front Image</div>
        <div onclick="openFullScreenImage('ID Back Preview', 'https://via.placeholder.com/800x500?text=ID+Back+Full+View')" style="flex:1; background:#f0f4f1; border: 1px dashed var(--line); padding: 20px; text-align:center; border-radius:6px; color: var(--muted); font-size:11px; cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='#e2ebe3'" onmouseout="this.style.background='#f0f4f1'">🔍 ID Back Image</div>
      </div>
    </div>
  `;
  
  document.getElementById("modal-approve-btn").onclick = function() {
    alert(`Application for ${producer.name} has been approved successfully!`);
    toggleProducerModal();
  };

  toggleProducerModal();
}

// Full-screen image viewer helper
function openFullScreenImage(title, imageSrc) {
  let fsViewer = document.getElementById("fullscreen-image-modal");
  
  // Create fullscreen modal dynamically if it doesn't exist yet
  if (!fsViewer) {
    fsViewer = document.createElement("div");
    fsViewer.id = "fullscreen-image-modal";
    fsViewer.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); z-index:4000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px;";
    document.body.appendChild(fsViewer);
  }
  
  fsViewer.innerHTML = `
    <div style="position:absolute; top:20px; right:30px; color:#fff; font-size:28px; cursor:pointer;" onclick="document.getElementById('fullscreen-image-modal').style.display='none'">✕</div>
    <div style="color:#fff; font-size:16px; margin-bottom:12px; font-weight:600;">${title}</div>
    <div style="max-width:90%; max-height:80vh; background:#222; padding:10px; border-radius:8px; display:flex; align-items:center; justify-content:center;">
      <img src="${imageSrc}" style="max-width:100%; max-height:75vh; object-fit:contain; border-radius:4px;" />
    </div>
  `;
  fsViewer.style.display = "flex";

}
   
    