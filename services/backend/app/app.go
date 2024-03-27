package app

import (
	"context"
	"database/sql"
	"net/http"
	h "server/app/handlers"
	"server/db"
	"strings"
)

type App struct {
	DB *db.DB
}

func NewApp(db *db.DB) *App {
	return &App{DB: db}
}

// ServeHTTP handles the incoming HTTP requests and routes them to the appropriate handlers.
func (a *App) ServeHTTP(database *sql.DB) {

	http.HandleFunc("/api/register", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleRegister(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/avatar", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)

		if r.Method == http.MethodPost {
			h.HandleUploadAvatar(w, r.WithContext(ctx))
		}

		if r.Method == http.MethodGet {
			h.HandleGetAvatar(w, r.WithContext(ctx))
		}
	})

	http.HandleFunc("/api/login", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleLogin(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/user", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetUser(w, r.WithContext(ctx))
	})
	http.HandleFunc("/api/user/status", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetUserStatus(w, r.WithContext(ctx))
	})
	http.HandleFunc("/api/user/posts", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetUserPosts(w, r.WithContext(ctx))
	})
	http.HandleFunc("/api/user/page-number", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetUserPageNumber(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/posts", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetPosts(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/post", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetPost(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/post/image", func(w http.ResponseWriter, r *http.Request) {
		h.HandleGetImage(w, r)
	})

	http.HandleFunc("/api/posts/create", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleCreatePost(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/posts/upload-image", func(w http.ResponseWriter, r *http.Request) {
		h.HandleUploadImage(w, r)
	})

	http.HandleFunc("/api/posts/page-number", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetPageNumber(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/comments/create", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleCreateComment(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/comments", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetComments(w, r.WithContext(ctx))
	})
	http.HandleFunc("/api/comment/image", func(w http.ResponseWriter, r *http.Request) {
		h.HandleGetImage(w, r)
	})

	http.HandleFunc("/api/comments/count", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetCommentsCount(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/post/likes", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleLikePost(w, r.WithContext(ctx))
	})
	http.HandleFunc("/api/user/follow", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleFollowUser(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/user/followers", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetFollowers(w, r.WithContext(ctx))
	})
	http.HandleFunc("/api/user/followed", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetFollowed(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/user/followers/", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		segments := strings.Split(r.URL.Path, "/")

		switch segments[4] {
		case "pending":
			h.HandleGetPendingFollowers(w, r.WithContext(ctx))
		case "accept":
			h.HandleAcceptFollower(w, r.WithContext(ctx))
		case "reject":
			h.HandleRejectFollower(w, r.WithContext(ctx))
		default:
			w.WriteHeader(http.StatusNotFound)
		}
	})
	http.HandleFunc("/api/groups/create", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleCreateGroup(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/groups", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetGroupList(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/group", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetGroup(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/group/members", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetGroupMembers(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/group/posts", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetGroupPosts(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/group/posts/page-number", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetGroupPostsPageNumber(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/group/join", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleJoinGroup(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/group/manage/", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		segments := strings.Split(r.URL.Path, "/")

		switch segments[4] {
		case "pending":
			h.HandleGetPendingJoin(w, r.WithContext(ctx))
		case "accept":
			h.HandleAcceptMember(w, r.WithContext(ctx))
		case "reject":
			h.HandleRejectMember(w, r.WithContext(ctx))
		default:
			w.WriteHeader(http.StatusNotFound)
		}
	})

	http.HandleFunc("/api/group/invite", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleInviteMember(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/group/invite/", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		segments := strings.Split(r.URL.Path, "/")

		switch segments[4] {
		case "pending":
			h.HandleGetPendingInvite(w, r.WithContext(ctx))
		case "accept":
			h.HandleAcceptInvite(w, r.WithContext(ctx))
		case "reject":
			h.HandleRejectInvite(w, r.WithContext(ctx))
		default:
			w.WriteHeader(http.StatusNotFound)
		}
	})
	http.HandleFunc("/api/group/event/create", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleCreateEvent(w, r.WithContext(ctx))
	})
	http.HandleFunc("/api/group/event/join", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleEvent(w, r.WithContext(ctx))
	})
	http.HandleFunc("/api/group/event", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleEventNotif(w, r.WithContext(ctx))
	})
}
