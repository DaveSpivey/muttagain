class ChangeUserReferenceToStringInGuesses < ActiveRecord::Migration[5.1]
  def change
  	remove_reference :guesses, :user, index: true
  	add_column :guesses, :user_id, :string
  end
end
