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
    mutt = Mutt.find(params[:mutt_id])
    user_id = current_user ? current_user.id : session[:session_id]
    existing_guesses = mutt.guesses.where(user_id: user_id)
    guesses_left = 3 - existing_guesses.length

    if guesses_left >= 0
      @guess = Guess.new({ mutt_id: params[:mutt_id], breed_id: params[:breedId], user_id: user_id })

      respond_to do |format|
        if @guess.save
          guesses_left -= 1
          format.json { render json: { guess: @guess, guesses_left: guesses_left } }
        else
          format.json { render json: @guess.errors }
        end
      end
    else
      respond_to do |format|
        format.json { render json: { guesses_left: guesses_left } }
      end
    end
  end

  # private

  # def guess_params
  #   params.require(:guess).permit(:user_id, :mutt_id, :value)
  # end
end