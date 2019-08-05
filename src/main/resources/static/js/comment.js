const COMMENT = (function () {
    'use strict';

    const commentEditTemplate =
        "<form accept-charset=\"utf-8\" method=\"post\" action =\"{{url}}\">" +
        "<div class=\"add-comment\">" +
        "<input id=\"{{contentsId}}\" name=\"contents\" type=\"hidden\">" +
        "<div id=\"{{editorId}}\" class = \"comment-editor\"></div>" +
        "<input name=\"_method\" type=\"hidden\" value=\"put\"/>" +
        "<button class=\"btn btn-default\" id=\"{{buttonId}}\" type=\"submit\">댓글 수정" +
        "</button>" + "</div>" +
        "</form>";


    const compiledCommentEditTemplate = Handlebars.compile(commentEditTemplate)


    const CommentController = function () {
        const commentService = new CommentService()

        const updateComment = function () {
            const comments = document.getElementById("comment-list")
            comments.addEventListener('click', commentService.update)
        }

        const init = function () {
            updateComment()
        }

        return {
            init: init
        }
    }

    const CommentService = function () {
        const update = function (event) {
            const target = event.target
            const parent = target.closest("li")
            const form = parent.getElementsByTagName("form")[0]
            if (target.classList.contains("comment-edit") &&
                (parent.getElementsByClassName("comment-editor").length === 0)) {
                const url = form.action
                const tokens = form.action.split('/')
                const commentId = tokens[tokens.length - 1]
                const editorId = "editSection" + commentId
                const contentsId = "comment-contents" + commentId
                const buttonId = "comment-edit-finish-button" + commentId

                parent.insertAdjacentHTML("beforeend",
                    compiledCommentEditTemplate({
                        "url": url,
                        "editorId": editorId,
                        "contentsId": contentsId,
                        "buttonId": buttonId
                    }))

                const editor2 = new tui.Editor({
                    el: document.querySelector('#' + editorId),
                    initialEditType: 'markdown',
                    previewStyle: 'horizontal',
                    events: {
                        change: function () {
                            document.getElementById(contentsId).setAttribute
                            ('value', editor2.getMarkdown())
                        }
                    },
                    height: '200px'
                });
            }
        }

        return {
            update: update
        }
    }

    const init = function () {
        const commentController = new CommentController()
        commentController.init()
    }

    return {
        init: init
    }

})();

COMMENT.init();

const saveButton = document.querySelector("#comment-save-button");
const articleId = document.querySelector("#article-id").value;
saveButton.addEventListener("click", savePost);

function savePost(e) {
    let contents = document.querySelector("#comment-contents").value;
    fetch("/articles/" + articleId + "/comments", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',

        },
        body: JSON.stringify({contents: contents}),
        credentials: "include"
    })
        .then(function (response) {
            if (!response.ok) {
                throw response;
            }
            return response.json()
        })
        .then((json) => {
            console.log(json)
            addComment(articleId, json['contents'], json['userName'], json['id'])
        })
        .catch(
            (e) => e.json().then(
                (json) => console.log(json)
            )
        )
}

function addComment(articleId, contents, userName, id) {
    let commentTemplate = document.querySelector('#comment-template').innerText
    let buttonTemplate = document.querySelector("#comment-button-template").innerHTML
    let comments = document.querySelector("#comment-list")


    commentTemplate = commentTemplate.split('{buttonTemplate}').join(buttonTemplate)
    let compiledCommentTemplate = Handlebars.compile(commentTemplate)
    comments.insertAdjacentHTML("beforeend", compiledCommentTemplate({
        "userName": userName,
        "contents": contents,
        "articleId": articleId,
        "commentId": id
    }))
}

