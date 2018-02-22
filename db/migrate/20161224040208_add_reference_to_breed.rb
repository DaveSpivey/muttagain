class AddReferenceToBreed < ActiveRecord::Migration[5.1]
  def change
    change_table :guesses do |t|
      t.remove :name, :link
      t.references :breed
    end
  end
end
