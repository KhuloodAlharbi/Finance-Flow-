document.addEventListener("DOMContentLoaded", () => {
  const notificationsSection = document.getElementById("notifications-section");

  // Function to fetch notifications data from the API
  async function fetchNotificationsData() {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `${window.location.origin}/api/notifications.php`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      // Check if budget is not set
      if (data.message === "No active budget found for the user") {
        notificationsSection.innerHTML = `
          <div class="bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded relative transition duration-500 transform hover:scale-105">
            <strong class="font-bold">Attention!</strong>
            <span class="block sm:inline">No active budget found for you.</span>
          </div>
        `;
        return;
      }

      // Check if the request was successful
      if (response.ok) {
        renderNotifications(data.notifications);
      } else {
        throw new Error("Failed to fetch notifications.");
      }
    } catch (error) {
      console.error("Error fetching notifications data:", error);
      notificationsSection.innerHTML = `
        <div class="bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded relative transition duration-500 transform hover:scale-105">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline">Something went wrong while fetching notifications. Please refresh the page.</span>
        </div>
      `;
    }
  }

  // Function to render notifications
  function renderNotifications(notifications) {
    // Clear previous notifications
    notificationsSection.innerHTML = "";

    // Check if there are notifications
    if (notifications.length === 0) {
      notificationsSection.innerHTML = `
        <div class="bg-green-200 border border-green-400 text-green-700 px-4 py-3 rounded relative transition duration-500 transform hover:scale-105">
          <strong class="font-bold">Great job!</strong>
          <span class="block sm:inline">You're staying within your budget!</span>
        </div>
      `;
      return;
    }

    // Loop through each notification and create notification elements
    notifications.forEach((notification) => {
      const { category_name, message, spent_percentage } = notification;

      // Determine the notification color based on spent_percentage
      let bgColor, textColor;

      if (spent_percentage >= 100) {
        bgColor = "bg-red-200";
        textColor = "text-red-700";
      } else if (spent_percentage > 80) {
        bgColor = "bg-orange-200"; // Light orange for warnings
        textColor = "text-orange-700";
      } else {
        bgColor = "bg-green-200"; // Light green for normal results
        textColor = "text-green-700";
      }

      // Create notification div
      const notificationDiv = document.createElement("div");
      notificationDiv.classList.add(
        bgColor,
        "border",
        `${bgColor.replace("bg-", "border-")}`,
        textColor,
        "px-4",
        "py-3",
        "rounded",
        "mb-2"
      );

      // Set notification content
      notificationDiv.innerHTML = `
        <strong class="font-bold">${
          category_name.charAt(0).toUpperCase() + category_name.slice(1)
        } </strong>
        <span class="block sm:inline">${message} (${spent_percentage}%)</span>
      `;

      // Append the notification div to the notifications section
      notificationsSection.appendChild(notificationDiv);
    });
  }

  // Fetch the notifications data when the page loads
  fetchNotificationsData();
});
