// STEP 1: Connect to Supabase
const supabaseUrl = "https://stnfukvtkwwmstkvweue.supabase.co";;
const supabaseKey = "sb_publishable_OGkWQw8s2AIkRQrqpLwIXQ_WTuDWOyN";

// Create Supabase client
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// STEP 2: Get form elements
const form = document.getElementById("expense-form");
const list = document.getElementById("expenses-list");

// STEP 3: Add expense
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;

  const { error } = await supabase
    .from("expenses")
    .insert([
      {
        description: description,
        amount: amount
      }
    ]);

  if (error) {
    console.error("Insert error:", error);
    return;
  }

  form.reset();
  loadExpenses();
});

// STEP 4: Load expenses from database
async function loadExpenses() {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Fetch error:", error);
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

// Load data when page starts
loadExpenses();
