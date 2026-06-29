import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1";

const runTests = async () => {
    console.log("=== STARTING BACKEND API INTEGRATION CHECKS ===");
    let cookie = "";

    try {
        // 1. Get public team list
        console.log("\n1. Testing GET /team...");
        const teamRes = await axios.get(`${BASE_URL}/team`);
        console.log(`Success! Found ${teamRes.data.data.length} team members.`);
        console.log(`First member: ${teamRes.data.data[0].name} (${teamRes.data.data[0].role})`);

        // 2. Get public projects list
        console.log("\n2. Testing GET /projects...");
        const projRes = await axios.get(`${BASE_URL}/projects`);
        console.log(`Success! Found ${projRes.data.data.projects.length} projects.`);
        console.log(`First project: ${projRes.data.data.projects[0].title} - $${projRes.data.data.projects[0].price}`);

        // 3. Get public blogs list
        console.log("\n3. Testing GET /blogs...");
        const blogRes = await axios.get(`${BASE_URL}/blogs`);
        console.log(`Success! Found ${blogRes.data.data.blogs.length} published blogs.`);
        console.log(`First blog: "${blogRes.data.data.blogs[0].title}" by ${blogRes.data.data.blogs[0].author.username}`);

        // 4. Submit contact form inquiry
        console.log("\n4. Testing POST /contacts (Submit Inquire)...");
        const contactRes = await axios.post(`${BASE_URL}/contacts`, {
            name: "Alice Smith",
            email: "alice@google.com",
            subject: "Redesign Project",
            message: "Hi, I need a modern redesign for our corporate site. Please share your availability."
        });
        console.log("Success! Inquiry submitted:", contactRes.data.data);

        // 5. Register a new test user
        const testUsername = `user_${Date.now()}`;
        console.log(`\n5. Testing POST /auth/register with user: ${testUsername}...`);
        const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
            username: testUsername,
            email: `${testUsername}@example.com`,
            password: "testpassword123"
        });
        console.log("Success! User registered:", registerRes.data.data);

        // 6. Login as the newly created user (to get auth tokens/cookies)
        console.log("\n6. Testing POST /auth/login...");
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            username: testUsername,
            password: "testpassword123"
        });
        console.log("Success! Logged in token received.");
        const token = loginRes.data.data.accessToken;
        
        // Save the cookie header for subsequent requests
        if (loginRes.headers["set-cookie"]) {
            cookie = loginRes.headers["set-cookie"].map(c => c.split(";")[0]).join("; ");
        }

        // Configure client with Auth details
        const authClient = axios.create({
            baseURL: BASE_URL,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(cookie ? { Cookie: cookie } : {})
            }
        });

        // 7. Get user's cart (authenticated)
        console.log("\n7. Testing GET /cart (authenticated)...");
        const cartRes = await authClient.get("/cart");
        console.log("Success! Cart fetched. Total price:", cartRes.data.data.totalPrice);

        // 8. Add project to cart
        const productToAdd = projRes.data.data.projects[0];
        console.log(`\n8. Testing POST /cart/items (Add project "${productToAdd.title}" to cart)...`);
        const addToCartRes = await authClient.post("/cart/items", {
            projectId: productToAdd._id
        });
        console.log("Success! Cart items count:", addToCartRes.data.data.items.length);
        console.log("New total price:", addToCartRes.data.data.totalPrice);

        // 9. Checkout cart
        console.log("\n9. Testing POST /cart/checkout (checkout simulation)...");
        const checkoutRes = await authClient.post("/cart/checkout");
        console.log("Success! Checkout Completed. Order details:", checkoutRes.data.data);

        console.log("\n=== ALL BACKEND API INTEGRATION CHECKS PASSED SUCCESSFULLY ===");
    } catch (error) {
        console.error("\nCheck failed! Error details:");
        if (error.response) {
            console.error("HTTP Status:", error.response.status);
            console.error("Response Data:", error.response.data);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
};

runTests();
