package core

type User struct {
	ID   int
	Name string
}

type UserRepository interface {
	GetUserByID(id int) (User, error)
	CreateUser(user User) (User, error)
}

type UserService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetUserByID(id int) (User, error) {
	return s.repo.GetUserByID(id)
}

func (s *UserService) CreateUser(user User) (User, error) {
	return s.repo.CreateUser(user)
}
