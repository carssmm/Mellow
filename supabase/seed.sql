-- Note: Replace 'your-user-id-here' with an actual user ID after signing up, 
-- or write a script that runs this and replaces it dynamically.

-- Example UUID to use if you want to hardcode for testing:
-- DO $$ 
-- DECLARE
--     test_user_id UUID := '00000000-0000-0000-0000-000000000000';
-- BEGIN
--     -- Insert mock user into auth.users if needed for local development
--     -- Then insert products...
-- END $$;

INSERT INTO public.products (user_id, name, category, selling_price, unit_cost, current_stock, low_stock_threshold, target_stock)
VALUES 
    -- Replace 'your-user-id-here' below when actually seeding real accounts
    -- ('your-user-id-here', 'Spanish Latte', 'Coffee', 120.00, 55.00, 18, 5, 20),
    -- ('your-user-id-here', 'Americano', 'Coffee', 100.00, 35.00, 24, 5, 20),
    -- ('your-user-id-here', 'Matcha Latte', 'Non-Coffee', 140.00, 65.00, 12, 5, 20),
    -- ('your-user-id-here', 'Butter Croissant', 'Pastries', 85.00, 40.00, 8, 5, 20),
    -- ('your-user-id-here', 'Iced Caramel Macchiato', 'Coffee', 130.00, 60.00, 30, 5, 20),
    -- ('your-user-id-here', 'Pour Over (Ethiopia)', 'Coffee', 150.00, 45.00, 5, 2, 10);
    (gen_random_uuid(), 'Spanish Latte', 'Coffee', 120.00, 55.00, 18, 5, 20); -- Dummy placeholder so it compiles
