# Environment Setup

Before you write code, you need to set up your computer. This is a one-time process.

1.  **Install Node.js**: Go to [nodejs.org](https://nodejs.org) and download the LTS version. This also installs `npm`, the Node Package Manager.

2.  **Install TypeScript**: Open your terminal or command prompt and run this command to install TypeScript globally on your machine.
    ```bash
    npm install -g typescript
    ```

3.  **Create Project Folder**: In your terminal, create a new folder for your project and navigate into it.
    ```bash
    mkdir my-ts-project && cd my-ts-project
    ```

4.  **Initialize TypeScript**: Run this command inside your new project folder to create a `tsconfig.json` file. This file contains all the settings for the TypeScript compiler.
    ```bash
    tsc --init
    ```

# How to Run Your TypeScript Code

Once you have a `.ts` file (like `example3.ts`), you need a way to execute it. Here are two common methods.

## Method 1: Compile First, then Run (The Standard Way)

This two-step process helps you see how TypeScript compiles into standard JavaScript.

1.  **Compile the `.ts` file**: Run the TypeScript compiler (`tsc`) on your file. This will create a new JavaScript (`.js`) file.
    ```bash
    tsc my-ts-project/example3.ts
    ```
2.  **Run the `.js` file**: Use Node.js to execute the newly created JavaScript file.
    ```bash
    node my-ts-project/example3.js
    ```

## Method 2: Run Directly with `ts-node` (Recommended for Development)

For a faster development workflow, you can use `ts-node` to compile and run your TypeScript code in a single command.

1.  **Install `ts-node`**: If you haven't already, add it to your project's development dependencies.
    ```bash
    npm install -D ts-node
    ```
2.  **Run the `.ts` file directly**: Use `npx` to run the `ts-node` command.
    ```bash
    npx ts-node my-ts-project/example3.ts
    ```

# Practice Exercises

Based on the concepts from the slides, try to complete the following exercises in a new `.ts` file inside your `my-ts-project` folder.

---

### Exercise 1: Variables & Basic Types

*(Concepts from Slides 8, 9, 24)*

Declare variables to describe a product for an e-commerce store.

1.  Create a `const` variable named `productName` and give it a `string` value (e.g., "Gaming Mouse").
2.  Create a `let` variable named `productPrice` and give it a `number` value (e.g., 79.99).
3.  Create a `const` variable named `isAvailable` and give it a `boolean` value (`true` or `false`).
4.  Log each variable to the console to see its value.

<details>
<summary>Click for Solution</summary>

```typescript
const productName: string = "Gaming Mouse";
let productPrice: number = 79.99;
const isAvailable: boolean = true;

console.log(`Product: ${productName}`);
console.log(`Price: $${productPrice}`);
console.log(`Available: ${isAvailable}`);
```

</details>

---

### Exercise 2: Objects & Interfaces

*(Concepts from Slides 12, 25, 26)*

Let's group the product information into a single, structured object.

1.  Define an `interface` named `Product`. It should have the following properties with their corresponding types:
    *   `name` (string)
    *   `price` (number)
    *   `isAvailable` (boolean)
2.  Create a `const` variable named `product1` and assign it an object that conforms to the `Product` interface.
3.  Use `console.log` and template literals to print a sentence describing the product, like "Product: Gaming Mouse, Price: $79.99".

<details>
<summary>Click for Solution</summary>

```typescript
interface Product {
  name: string;
  price: number;
  isAvailable: boolean;
}

const product1: Product = {
  name: "Ergonomic Keyboard",
  price: 120,
  isAvailable: false,
};

console.log(`Product: ${product1.name}, Price: $${product1.price}`);
```

</details>

---

### Final Challenge: The Student Task from the Slides

*(Concepts from Slides 29, 30)*

This is the main task from the presentation. Your goal is to create a fully-typed function that finds a "To-Do" item from a list.

1.  In a new file (`task.ts`), copy the starter code below.
2.  Add all the necessary TypeScript type annotations to the `findTodoById` function parameters and its return value.
3.  Complete the function body. It should return the matching `TodoItem` object or `undefined` if no item with the given `id` is found.
4.  Call your function with a valid `id` (e.g., `2`) and an invalid `id` (e.g., `99`) and log the results to see if it works.

**Starter Code:**

```typescript
// Starter Code for the Final Challenge
interface TodoItem { 
  id: number; 
  text: string; 
  completed: boolean; 
}

const todoItems: TodoItem[] = [
  { id: 1, text: 'Learn TypeScript', completed: true },
  { id: 2, text: 'Setup tsconfig.json', completed: true },
  { id: 3, text: 'Write a typed function', completed: false },
];

// 👇 YOUR CODE GOES HERE 👇
function findTodoById(items, id) {
  // Hint: return items.find(item => item.id === id);
}

// Example calls
const foundItem = findTodoById(todoItems, 2);
const notFoundItem = findTodoById(todoItems, 99);

console.log('Found:', foundItem);
console.log('Not Found:', notFoundItem);
```

<details>
<summary>Click for Solution</summary>

```typescript
// Solution
function findTodoById(items: TodoItem[], id: number): TodoItem | undefined {
  return items.find(item => item.id === id);
}
```

</details>

    