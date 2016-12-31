class GuessesController < ApplicationController

  def index
    @guesses = Guess.where(mutt_id: params[:mutt_id])
    respond_to do |format|
      format.html
      format.js
      format.json { render json: @guesses }
    end
  end

  def create
    @guess = Guess.new({ mutt_id: params[:mutt_id], breed_id: params[:breedId] })
    @guess.user_id = current_user ? current_user.id : nil

    respond_to do |format|
      if @guess.save
        format.json { render json: @guess }
      else
        format.json { render json: @guess.errors }
      end
    end
  end

  # private

  # def guess_params
  #   params.require(:guess).permit(:user_id, :mutt_id, :value)
  # end
end