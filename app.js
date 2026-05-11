// Supabase connection
const supabaseUrl = "https://tuapoyqycjkxfbdlxedc.supabase.co";
const supabaseKey = "sb_publishable_1MYY6J4KJzNhmnBrIA13BA_GM5OayRt
"; // your publishable key
const client = supabase.createClient(supabaseUrl, supabaseKey);

// DOM elements
const form = document.getElementById("expense-form");
const list = document.getElementById("expenses-list");
const totalSpan = document.getElementById("total");

// Add expense
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;

  const { error } = await client.from("expenses").insert([
    { description, amount }
  ]);

  if (error) {
    console.error("Insert error:", error.message);
    return;
  }

  form.reset();
  loadExpenses();
});

// Load expenses
async function loadExpenses() {
  const { data, error } = await client
    .from("expenses")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Fetch error:", error.message);
    return;
  }

  list.innerHTML = "";
  let total = 0;

  data.forEach((expense) => {
    total += parseFloat(expense.amount);

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${expense.description}</span>
      <span>$${expense.amount}</span>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;
    list.appendChild(li);

    // Edit functionality
    li.querySelector(".edit-btn").addEventListener("click", () => {
      document.getElementById("description").value = expense.description;
      document.getElementById("amount").value = expense.amount;
      li.remove();
    });

    // Delete functionality
    li.querySelector(".delete-btn").addEventListener("click", async () => {
      await client.from("expenses").delete().eq("id", expense.id);
      loadExpenses();
    });
  });

  totalSpan.textContent = total.toFixed(2);
}

// Initial load
loadExpenses();
