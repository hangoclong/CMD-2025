// The same function, but now with types!
function calculateTotalPrice(price: number, quantity: number): number {
  return price * quantity;
}

// Correct usage: We call the function and log its return value.
const totalPrice = calculateTotalPrice(10, 5);
console.log(`The total price is: ${totalPrice}`); // Expected output: The total price is: 50

// The comment in the original file was demonstrating how TypeScript catches errors.
// The following line, if uncommented, would produce the error because '10' is a string.
// calculateTotalPrice('10', 5);
// ❌ Argument of type 'string' is not assignable to parameter of type 'number'.