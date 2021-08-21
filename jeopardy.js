// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
let categoryIds = [];
const board = document.getElementById('board');
const body = document.querySelector('body')
const gif = document.createElement('img')
gif.setAttribute('id', 'loadingGif')
gif.setAttribute('src', 'Spinner-1s-200px.gif')

// async function getLoadingGif() {
//     const res = 
// }

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds(num) {
    const offSet = Math.floor(Math.random() * 100);
    const res = await axios.get(`http://jservice.io/api/categories?count=${num}&offset=${offSet}`);
    for(let i = 0; i < num; i++){
        categoryIds.push(res.data[i].id)
    }
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategories(id) {
    const res = await axios.get(`http://jservice.io/api/category?id=${id}`);
    let obj = {};
    let clueArray = [];
    for(let i = 0; i < 5; i++){
        let newObj = {}
        newObj.question = `${res.data.clues[i].question}`
        newObj.answer = `${res.data.clues[i].answer}`
        newObj.showing = null;
        clueArray.push(newObj)
    }
    obj.title = `${res.data.title}`;
    obj.clues = clueArray;
    categories.push(obj);
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    const table = document.createElement('table');
    table.setAttribute('id', 'jTable')
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');
    let headTd = document.createElement('tr');

    for(let i = 0; i < 6; i++){
        let newTd = document.createElement('th');
        console.log(categories)
        newTd.innerHTML = `<b>${categories[i].title}</b>`;
        newTd.setAttribute('id', i);
        newTd.classList = 'category'
        headTd.append(newTd);
    };

    tableHead.append(headTd);

    for(let i = 0; i < 5; i++){
        let newTr = document.createElement('tr');
        newTr.setAttribute('id', i);
        for(let j = 0; j < 6; j++){
            let newTd = document.createElement('td');
            let newQuestion = document.createElement('div');
            // newTd.innerText = `$${(i + 1) * 100}`; 
            newQuestion.innerText = '?';
            newQuestion.classList = 'questionCard';
            newTd.setAttribute('id', j);
            newTd.classList = 'null';
            newTd.addEventListener('click', this.handleClick.bind(this));
            newTd.appendChild(newQuestion);
            newTr.appendChild(newTd);
        };
        tableBody.appendChild(newTr);
    };

    // tableBody.appendChild(tr);
    table.appendChild(tableHead);
    table.appendChild(tableBody);
    board.appendChild(table);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    eText = evt.path[0].innerHTML
    // console.log(eText)
    console.log(evt)
    eId = evt.target.id
    ePathId = evt.path[1].id
    ePath2Id = evt.path[2].id
    eClass = evt.target.classList
    console.log(`This is the target class: ${eClass}`)

    if(eClass == 'questionCard'){
        // text
        evt.path[1].innerHTML = categories[ePathId].clues[ePath2Id].question
        // class
        evt.path[1].classList = 'question'
        console.log(evt.target.classList)
    } else if(eClass == 'question'){ 
        // showing
        categories[eId].clues[ePathId].showing = 'answer'
        // text
        evt.path[0].innerHTML = categories[eId].clues[ePathId].answer
        // class
        evt.target.classList = 'answer'
    } else {
        console.log('did not work')
        return
    }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

async function showLoadingView() {
    board.append(gif)
    // console.log(categories)

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    board.children[0].remove();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    if(document.getElementById('jTable')){
        document.getElementById('jTable').remove()
    }
    showLoadingView();
    categories = [];
    categoryIds = []
    await getCategoryIds(6)
    // console.log(categoryIds)
    for(let i = 0; i < categoryIds.length; i++){
        await getCategories(categoryIds[i]);
    }
    setTimeout(hideLoadingView(), 5000)
    setTimeout(fillTable(), 6000)
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO

const toggleButton = document.getElementById('jButton');
toggleButton.innerText = 'Start';
toggleButton.addEventListener('click', function(e){
    e.preventDefault();
    toggleButton.innerText = 'Reset'
    setupAndStart()
})