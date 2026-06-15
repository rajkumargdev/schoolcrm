fn main() {
    let hash = bcrypt::hash("rajkumar123", bcrypt::DEFAULT_COST).unwrap();
    println!("{}", hash);
}
