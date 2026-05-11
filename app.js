const supabaseUrl = "https://stnfukvtkwwmstkvweue.supabase.co";
const supabaseKey = "sb_publishable_OGkWQw8s2AIkRQrqpLwIXQ_WTuDWOyN"; // paste your sb_publishable_... key here

// IMPORTANT: DO NOT name this "supabase"
const client = supabase.createClient(supabaseUrl, supabaseKey);

// Get form elements
const form = document.getElementById("expense-form");
const list = document.getElementById("expenses-list");

// Add expense
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;

  const { error } = await client
    .from("expenses")
    .insert([
      {
        description: description,
        amount: amount
      }
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

  data.forEach((expense) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${expense.description}</span>
      <span>$${expense.amount}</span>
    `;
    list.appendChild(li);
  });
}

// Initial load
loadExpenses();
// Load data when page starts
loadExpenses();
