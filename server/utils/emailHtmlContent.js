module.exports = (
  receiverName,
  senderName,
  festivalName,
  festivalDate,
  festivalLink,
  festivalTickets
) => {
  return `<h2>Festival Fanatic</h2>
            <strong>Hello ${receiverName},</strong>
            <p>${senderName} just shared an event with you, here are the details:</p>
            <p>Event: ${festivalName}</p>
            <p>Event date: ${festivalDate}</p>
            <p>Event Details: ${festivalLink}</p>
            <p>Event tickets: ${festivalTickets}</p>
            `;
};

