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
      if (userResponse.status === 404) {
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
    renderRepos(repos);
  } catch (error) {
    const message = error?.message || "Something went wrong.";
    profileContainer.innerHTML = `<div class="repo-error">${message}</div>`;
    repoContainer.innerHTML = `<div class="repo-error">${message}</div>`;
  }
}

function renderProfile(user) {
  profileContainer.innerHTML = `
  <div class="profile-card profile-card--centered">
  <img src= "${user.avatar_url}" alt= "${user.login} avatar" class="profile-avatar"/>
  <div class="profile-card__content">
        <span class="profile-chip">@${user.login}</span>
        <h3>${user.name || user.login}</h3>
        <p class="profile-bio">${user.bio || "No bio available."}</p>

        <div class="profile-card__meta">
          ${user.location ? `<span>${user.location}</span>` : ""}
          ${user.blog ? `<a href="${user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}" target="_blank">Website</a>` : ""}
        </div>

        <div class="profile-card__stats">
          <div class="profile-stat"><strong>${user.public_repos}</strong><span>Repos</span></div>
          <div class="profile-stat"><strong>${user.followers}</strong><span>Followers</span></div>
          <div class="profile-stat"><strong>${user.following}</strong><span>Following</span></div>
        </div>
      </div>
    </div>`;
}

function getRepoDescription(repo) {
  const description = repo.description || "No description available.";
  const maxLength = 110;
  if (description.length <= maxLength) {
    return {
      short: description,
      full: description,
      truncated: false,
    };
  }

  return {
    short: `${description.slice(0, maxLength).trim()}…`,
    full: description,
    truncated: true,
  };
}

function renderRepos(repos) {
  if (repos.length === 0) {
    repoContainer.innerHTML = `<div class="repo-empty">This user has no public repositories.</div>`;
    return;
  }

  const repoCards = repos
    .map((repo) => {
      const description = getRepoDescription(repo);

      return `
        <div class="repo-card">
          <div class="repo-card__header">
            <div>
              <h3>${repo.name}</h3>
              <p class="repo-description">
                <span class="repo-description__short">${description.short}</span>
                <span class="repo-description__full">${description.full}</span>
              </p>
              ${description.truncated ? '<button class="see-more-btn" type="button">See more</button>' : ""}
            </div>
            <div class="repo-card__meta">
              <span>${repo.private ? "Private" : "Public"}</span>
              <span>${repo.language || "Unknown"}</span>
            </div>
          </div>
          <div class="repo-card__footer">
            <span>Last updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
            <a href="${repo.html_url}" target="_blank">View repository</a>
          </div>
        </div>
      `;
    })
    .join("");

  repoContainer.innerHTML = repoCards;
}

if (repoContainer) {
  repoContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".see-more-btn");
    if (!button) return;

    const card = button.closest(".repo-card");
    if (!card) return;

    const expanded = card.classList.toggle("expanded");
    button.textContent = expanded ? "Show less" : "See more";
  });
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
