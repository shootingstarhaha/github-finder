class GitHub {
  async getUser(username) {
    const profileRes = await fetch(`https://api.github.com/users/${username}`);
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=created&per_page=5`);

    const profile = await profileRes.json();
    const repos = await reposRes.json();

    return { profile, repos };
  }
}

class UI {
  constructor() {
    this.profile = document.getElementById('profile');
    this.repos = document.getElementById('repos');
    this.spinner = document.getElementById('spinner');
  }

  showProfile(user) {
    this.profile.innerHTML = `
      <div class="card">
        <div style="display: flex;">
          <img src="${user.avatar_url}" width="150" style="border-radius: 8px; margin-right: 20px;">
          <div>
            <a href="${user.html_url}" target="_blank">
              <button style="padding: 10px; background: royalblue; color: white; border: none; border-radius: 5px;">View Profile</button>
            </a>
            <p class="badge bg-blue">Public Repos: ${user.public_repos}</p>
            <p class="badge bg-grey">Public Gists: ${user.public_gists}</p>
            <p class="badge bg-green">Followers: ${user.followers}</p>
            <p class="badge bg-green">Following: ${user.following}</p>
          </div>
        </div>
        <br/>
        <ul>
          <li>Company: ${user.company}</li>
          <li>Website/Blog: <a href="${user.blog}" target="_blank">${user.blog}</a></li>
          <li>Location: ${user.location}</li>
          <li>Member Since: ${user.created_at}</li>
        </ul>
        <img src="https://ghchart.rshah.org/${user.login}" alt="잔디밭 그래프" style="width: 100%; margin-top: 10px;" />
      </div>
    `;
  }

  showRepos(repos) {
    let output = '<h3>Latest Repos</h3>';
    repos.forEach(repo => {
      output += `
        <div class="card">
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          <br/>
          <span class="badge bg-blue">Stars: ${repo.stargazers_count}</span>
          <span class="badge bg-grey">Watchers: ${repo.watchers_count}</span>
          <span class="badge bg-green">Forks: ${repo.forks_count}</span>
        </div>
      `;
    });
    this.repos.innerHTML = output;
  }

  clearProfile() {
    this.profile.innerHTML = '';
    this.repos.innerHTML = '';
  }

  showSpinner() {
    this.spinner.classList.remove('hidden');
  }

  hideSpinner() {
    this.spinner.classList.add('hidden');
  }
}

const github = new GitHub();
const ui = new UI();

document.getElementById('searchUser').addEventListener('keyup', async (e) => {
  const userText = e.target.value.trim();

  if (userText !== '') {
    ui.showSpinner();
    const { profile, repos } = await github.getUser(userText);

    if (profile.message === 'Not Found') {
      ui.clearProfile();
      ui.repos.innerHTML = '<p style="color: red;">User not found</p>';
    } else {
      ui.showProfile(profile);
      ui.showRepos(repos);
    }
    ui.hideSpinner();
  } else {
    ui.clearProfile();
  }
});
