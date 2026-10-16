export function loadBooking() {
  const savedBooking = localStorage.getItem("booking");

  if (!savedBooking) {
    return undefined;
  }

  try {
    return JSON.parse(savedBooking);
  } catch {
    return undefined;
  }
}

export function saveBooking(booking) {
  localStorage.setItem("booking", JSON.stringify(booking));
}

export function clearBooking() {
  localStorage.removeItem("booking");
}
