class SessionsController < ApplicationController

  def new
  end

  def create
    @user = User.find_by(username: params[:username])

    respond_to do |format|
      if @user && @user.authenticate(params[:password])
        session[:user_id] = @user.id
        format.json { render json: @user }
      else
        flash[:error] = "Invalid email/password combination, please try again"
        format.json { render json: {invalid: "email/password combination, please try again"} }
      end
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to '/'
  end

end