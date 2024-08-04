const accessKey = 'B-OlwcI4moNMsi4yjDaa2aQYUlLAgiIlnQS_7nm0EU0';

const formEl = document.getElementById('search-form');
const inputEl = document.getElementById('search-input');
const searchResults = document.querySelector('.search-results');
const showMoreButton = document.getElementById('show-more-button');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalDescription = document.getElementById('modal-description');
const modalTags = document.getElementById('modal-tags');
const commentsList = document.getElementById('comments-list');
const commentInput = document.getElementById('comment-input');
const postCommentButton = document.getElementById('post-comment');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const loginModal = document.getElementById('login-modal');
const loginSubmit = document.getElementById('login-submit');

let page = 1;
let total_pages = 1;

async function searchImages() {
    const query = inputEl.value;
    const color = document.getElementById('color-filter').value;
    const orientation = document.getElementById('orientation-filter').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const imageType = document.getElementById('image-type').value;

    let url = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${accessKey}`;

    if (color) url += `&color=${color}`;
    if (orientation) url += `&orientation=${orientation}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;
    if (imageType) url += `&content_filter=${imageType}`;

    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;
    total_pages = data.total_pages;

    if (page === 1) {
        searchResults.innerHTML = "";
    }

    results.forEach((result) => {
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add("search-result");

        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description;

        const imageLink = document.createElement("a");
        imageLink.href = result.links.html;
        imageLink.target = "_blank";
        imageLink.textContent = result.alt_description;

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(imageLink);

        imageWrapper.addEventListener('click', () => {
            modalImage.src = result.urls.regular;
            modalDescription.textContent = result.alt_description || 'No description available';
            modalTags.innerHTML = result.tags.map(tag => `<span>${tag.title}</span>`).join(' ');
            imageModal.style.display = 'flex';
        });

        searchResults.appendChild(imageWrapper);
    });

    page++;
    prevPageButton.disabled = page === 2;
    nextPageButton.disabled = page >= total_pages;

    if (total_pages > page) {
        showMoreButton.style.display = "block";
    } else {
        showMoreButton.style.display = "none";
    }
}

formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    page = 1;
    searchImages();
});

showMoreButton.addEventListener('click', searchImages);

prevPageButton.addEventListener('click', () => {
    if (page > 1) {
        page--;
        searchImages();
    }
});

nextPageButton.addEventListener('click', () => {
    if (page < total_pages) {
        page++;
        searchImages();
    }
});

document.getElementById('close-modal').addEventListener('click', () => {
    imageModal.style.display = 'none';
});

postCommentButton.addEventListener('click', () => {
    const comment = commentInput.value.trim();
    if (comment) {
        const li = document.createElement('li');
        li.textContent = comment;
        commentsList.appendChild(li);
        commentInput.value = '';
    }
});

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Toggle Light Mode' : 'Toggle Dark Mode';
});

loginSubmit.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});
