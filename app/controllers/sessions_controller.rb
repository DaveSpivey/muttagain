class SessionsController < ApplicationController

  def new
  end

  def create
    @user = User.find_by_email(params[:email])
    if @user && @user.authenticate(params[:password])
      session[:user_id] = @user.id
      redirect_to user_path(@user)
    else
      flash[:error] = "Invalid email/password combination, please try again"
      redirect_to mutts_path
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to '/'
  end

end