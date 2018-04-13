class ApplicationController < ActionController::Base
  helper ReactHelper

  protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }
  helper_method :current_user, :logged_in?

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id] && User.where(id: session[:user_id]).length > 0
  end

  def logged_in?
    current_user != nil
  end
end
