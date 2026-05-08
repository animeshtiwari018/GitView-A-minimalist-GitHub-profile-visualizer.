const searchBtn = document.getElementById("searchButton");
const userNameInput = document.getElementById("usernameinput");
const profileContainer = document.getElementById("profileContainer");
const repoContainer = document.getElementById("repoContainer");

async function searchGithub() {
  const username = userNameInput.value.trim();

  // STEP 1 → Validation
  if (!username) {
    alert("Please enter a GitHub username!");
    return;
  }

  try {
    // STEP 2 → Fetch data from GitHub API
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos`),
    ]);

    if (!userResponse.ok) {
      if (!userResponse.status === 404) {
        throw new Error(
          "User not found! Please check the username and try again",
        );
      }
      throw new Error(
        "Unable to fetch the GitHub user profile. Please try again later.",
      );
    }

    if (!reposResponse.ok) {
      throw new Error(
        "Unable to fetch repositories at this time. Please try again later.",
      );
    }

    const profile = await userResponse.json();
    const repos = await reposResponse.json();

    renderProfile(profile);
    rederRepos(repos);
  } catch (error) {
    profileContainer.innerHTML = `div class="repo-error>${error.messsage}</div>`;
    repoContainer.innerHTML = `<div class= "repo-error">${error.messsage}</div>`;
  }
}

function renderProfile(user){
  profileContainer.innerHTML = `
  <div class="profile-card profile`
}
// // STEP 3 → Check response
// console.log("User Response Object:");
// console.log(userResponse);

// console.log("Repos Response Object:");
// console.log(reposResponse);

// STEP 4 → Convert JSON into JS Object

//     // STEP 5 → Print actual data
//     console.log("Profile Data:");
//     console.log(profile);

//     console.log("Repos Data:");
//     console.log(repos);
//   } catch (error) {
//     console.log("Error:", error.message);
//   }
// }

if (searchBtn) {
  searchBtn.addEventListener("click", searchGithub);
}

if (userNameInput) {
  userNameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchGithub();
    }
  });
}
