function loadBooking () {
  var savedBooking =
    localStorage.getItem("booking");

  if (!savedBooking) {
    return undefined;
  }

  try {
    return JSON.parse(savedBooking);
  } catch {
    return undefined;
  }
}

function saveBooking (booking) {
  localStorage.setItem(
    "booking",
    JSON.stringify(booking)
  );
}

function clearBooking () {
  localStorage.removeItem("booking");
}

export {
  loadBooking,
  saveBooking,
  clearBooking
};