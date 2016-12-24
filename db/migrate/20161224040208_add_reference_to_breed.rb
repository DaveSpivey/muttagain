class AddReferenceToBreed < ActiveRecord::Migration
  def change
    change_table :guesses do |t|
      t.remove :name, :link
      t.references :breed
    end
  end
end
