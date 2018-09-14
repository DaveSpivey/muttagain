class UsersController < ApplicationController
  helper ReactHelper

  before_action :set_user, only: [:show, :edit, :update, :destroy]
  wrap_parameters :user, include: [:name, :password, :password_confirmation]

  def show
    @profile = @user == current_user
  end

  def new
  end

  def create
    @user = User.new(user_params)
    
    respond_to do |format|
      if @user.save
        session[:user_id] = @user.id
        format.json { render json: @user }
      else
        flash[:error] = "Invalid email/password combination, please try again"
        format.json { render json: @user.errors }
      end
    end
  end

private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:username, :password, :password_confirmation)
  end

end