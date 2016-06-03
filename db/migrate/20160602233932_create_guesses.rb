class CreateGuesses < ActiveRecord::Migration
  def change
    create_table :guesses do |t|
      t.string :name
      t.string :link
      t.references :user
      t.references :mutt
      t.integer :value

      t.timestamps
    end
  end
end
